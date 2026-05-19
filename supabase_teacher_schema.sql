-- =====================================================
-- 教师平台数据库结构（可重复执行，自动覆盖）
-- 在 Supabase 控制台 → SQL Editor 里粘贴执行
-- =====================================================

-- 1. 教师信息表
CREATE TABLE IF NOT EXISTS teachers (
  id         UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  name       TEXT NOT NULL,
  school     TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. 班级表
CREATE TABLE IF NOT EXISTS classes (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  teacher_id UUID REFERENCES teachers(id) ON DELETE CASCADE NOT NULL,
  name       TEXT NOT NULL,
  class_code TEXT UNIQUE NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. 学生表
CREATE TABLE IF NOT EXISTS class_students (
  id           UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  class_id     UUID REFERENCES classes(id) ON DELETE CASCADE NOT NULL,
  display_name TEXT NOT NULL,
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(class_id, display_name)
);

-- 4. 学生每日打卡表
CREATE TABLE IF NOT EXISTS student_checkins (
  id              UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id      UUID REFERENCES class_students(id) ON DELETE CASCADE NOT NULL,
  date            DATE NOT NULL DEFAULT CURRENT_DATE,
  sentences_done  INT DEFAULT 0,
  words_done      INT DEFAULT 0,
  minutes         INT DEFAULT 0,
  UNIQUE(student_id, date)
);

-- 5. 学生进度表
CREATE TABLE IF NOT EXISTS student_progress (
  id         UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  student_id UUID REFERENCES class_students(id) ON DELETE CASCADE NOT NULL,
  item_key   TEXT NOT NULL,
  status     TEXT DEFAULT 'new',
  attempts   INT DEFAULT 0,
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(student_id, item_key)
);

-- =====================================================
-- 开启 RLS
-- =====================================================
ALTER TABLE teachers         ENABLE ROW LEVEL SECURITY;
ALTER TABLE classes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE class_students   ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_checkins ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_progress ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- 删除旧 Policy（忽略不存在的错误）
-- =====================================================
DROP POLICY IF EXISTS "teacher_self"           ON teachers;
DROP POLICY IF EXISTS "teacher_own_classes"    ON classes;
DROP POLICY IF EXISTS "teacher_see_students"   ON class_students;
DROP POLICY IF EXISTS "teacher_see_checkins"   ON student_checkins;
DROP POLICY IF EXISTS "teacher_see_progress"   ON student_progress;
DROP POLICY IF EXISTS "student_find_class"     ON classes;
DROP POLICY IF EXISTS "student_join_class"     ON class_students;
DROP POLICY IF EXISTS "student_checkin"        ON student_checkins;
DROP POLICY IF EXISTS "student_progress_rw"    ON student_progress;

-- =====================================================
-- 重建 Policy
-- =====================================================

-- 教师只能看/改自己的记录
CREATE POLICY "teacher_self" ON teachers
  FOR ALL USING (auth.uid() = id);

-- 教师只能管理自己的班级
CREATE POLICY "teacher_own_classes" ON classes
  FOR ALL USING (teacher_id = auth.uid());

-- 教师可以查看自己班级的学生
CREATE POLICY "teacher_see_students" ON class_students
  FOR ALL USING (
    class_id IN (SELECT id FROM classes WHERE teacher_id = auth.uid())
  );

-- 教师可以看自己班级学生的打卡
CREATE POLICY "teacher_see_checkins" ON student_checkins
  FOR ALL USING (
    student_id IN (
      SELECT cs.id FROM class_students cs
      JOIN classes c ON cs.class_id = c.id
      WHERE c.teacher_id = auth.uid()
    )
  );

-- 教师可以看自己班级学生的进度
CREATE POLICY "teacher_see_progress" ON student_progress
  FOR ALL USING (
    student_id IN (
      SELECT cs.id FROM class_students cs
      JOIN classes c ON cs.class_id = c.id
      WHERE c.teacher_id = auth.uid()
    )
  );

-- 学生（匿名）可以按 class_code 查班级
CREATE POLICY "student_find_class" ON classes
  FOR SELECT USING (true);

-- 学生可以加入班级（插入自己）
CREATE POLICY "student_join_class" ON class_students
  FOR INSERT WITH CHECK (true);

-- 学生可以读取自己班级的成员列表（用于去重检查）
CREATE POLICY "student_read_classmates" ON class_students
  FOR SELECT USING (true);

-- 学生可以写入/更新自己的打卡
CREATE POLICY "student_checkin" ON student_checkins
  FOR ALL USING (true);

-- 学生可以读写自己的进度
CREATE POLICY "student_progress_rw" ON student_progress
  FOR ALL USING (true);

-- =====================================================
-- 工具函数：生成随机班级码
-- =====================================================
CREATE OR REPLACE FUNCTION generate_class_code()
RETURNS TEXT AS $$
DECLARE
  chars TEXT := 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  code  TEXT := '';
  i     INT;
BEGIN
  FOR i IN 1..6 LOOP
    code := code || substr(chars, floor(random() * length(chars) + 1)::int, 1);
  END LOOP;
  RETURN code;
END;
$$ LANGUAGE plpgsql;
