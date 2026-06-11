import { useState, useCallback, useEffect, useRef } from 'react'
const API = 'https://okenglish.site/api'
/** 为 true 时课程广场与教材全员可用（不依赖登录会员标记） */
const UNLOCK_ALL_COURSES = false
async function apiPost(path, body, token) {
  try {
    const res = await fetch(API + path, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(body)
    })
    const text = await res.text()
    try {
      return JSON.parse(text)
    } catch {
      return { error: res.ok ? '服务器响应异常' : `请求失败 (${res.status})` }
    }
  } catch {
    return { error: '网络连接失败，请检查网络后重试' }
  }
}
async function apiGet(path, token) {
  try {
    const res = await fetch(API + path, {
      headers: { ...(token ? { Authorization: `Bearer ${token}` } : {}) }
    })
    const text = await res.text()
    try {
      return JSON.parse(text)
    } catch {
      return { error: res.ok ? '服务器响应异常' : `请求失败 (${res.status})` }
    }
  } catch {
    return { error: '网络连接失败，请检查网络后重试' }
  }
}
import TeacherDashboard from './components/TeacherDashboard'
import StudentJoin from './components/StudentJoin'
import { useStudentCheckin } from './hooks/useStudentCheckin'
import { unlockAudio, isAudioUnlocked } from './utils/audioUnlock'
import PageBackBar from './components/PageBackBar'
import ExerciseView from './components/ExerciseView'
import ImportPanel from './components/ImportPanel'
import SentenceList from './components/SentenceList'
import Settings from './components/Settings'
import Dashboard from './components/Dashboard'
import Courses from './components/Courses'
import Shop from './components/Shop'
import Textbook from './components/Textbook'
import Grammar from './components/Grammar'
import ExerciseQuiz, { generateQuiz } from './components/ExerciseQuiz'
import Quiz from './components/Quiz'
import FillBlank from './components/FillBlank'
import SyncPractice from './components/SyncPractice'
import VocabStudy from './components/VocabStudy'
import AlphabetLearn from './components/AlphabetLearn'
import PhonemeLearn from './components/PhonemeLearn'
import PhonicsLesson from './components/PhonicsLesson'
import TypingPractice from './components/TypingPractice'
import GutenbergReading from './components/GutenbergReading'
import MemberPage from './components/MemberPage'
import ReferralCenter from './components/ReferralCenter'
import FounderCenter from './components/FounderCenter'
import MicPermissionSheet from './components/MicPermissionSheet'
import { STUDY_KIND } from './studyHistory'
import { supabase } from './lib/supabase'
import { useProgress, getRecentErrors } from './hooks/useProgress'
import { useXP } from './hooks/useXP'
import { useCrystal } from './hooks/useCrystal'
import { useSound } from './hooks/useSound'
import CrystalPanel from './components/CrystalPanel'
import WhackAMole from './components/WhackAMole'
import FrogJump from './components/FrogJump/FrogJump'
import GameLauncher from './components/GameLauncher'
import Leaderboard from './components/Leaderboard'
import useUnlocks from './hooks/useUnlocks'
import AICoach from './components/AICoach/AICoach'
import AboutSite from './components/AboutSite'
import MobileLearnApp from './mobile/MobileLearnApp'
import {
  isCapacitorNative,
  setMobileShellEnabled,
  shouldAutoLaunchMobileShell,
  shouldHideMainChrome,
} from './mobile/nativeShell'
import CloseBadge from './components/CloseBadge'
import { useHistoryLayer } from './hooks/useHistoryLayer'
import CrystalFloat from './components/CrystalFloat'
import GemSVG from './components/GemSVG'
import PetAvatar from './components/PetAvatar'
import AvatarPicker from './components/AvatarPicker'
import sampleData from './data/sample.json'
import changyongData from './data/changyong.json'
import grade4DownData from './data/grade4_down.json'
import grade3UpData from './data/grade3_up.json'
import grade3DownData from './data/grade3_down.json'
import grade4UpData from './data/grade4_up.json'
import grade5UpData from './data/grade5_up.json'
import grade5DownData from './data/grade5_down.json'
import grade6UpData from './data/grade6_up.json'
import grade6DownData from './data/grade6_down.json'
import renai7upData from './data/renai_7up.json'
import renai7downData from './data/renai_7down.json'
import renai8upData from './data/renai_8up.json'
import renai8downData from './data/renai_8down.json'
import renai9upData from './data/renai_9up.json'
import renai9downData from './data/renai_9down.json'
import bsdaB1Data from './data/bsda_b1.json'
import bsdaB2Data from './data/bsda_b2.json'
import bsdaB3Data from './data/bsda_b3.json'
import bsdaS1Data from './data/bsda_s1.json'
import bsdaS2Data from './data/bsda_s2.json'
import bsdaS3Data from './data/bsda_s3.json'
import bsdaS4Data from './data/bsda_s4.json'
import {
  IconHome, IconPencil, IconBookOpen, IconBook,
  IconGraduationCap, IconDownload, IconSettings, IconSparkles, IconGamepad,
  IconArchive, IconCalendar, IconStar, IconRefresh, IconCrown, IconUsers,
  IconUser,
  IconMenu,
  IconArrowLeft, IconArrowRight, IconRotateCcw,
  IconCheck, IconBookmark, IconInfo, IconSplit,
  IconCheckSquare, IconEdit, IconKeyboard, IconList, IconBell, IconMessageSquare,
  IconSun, IconMoon,
} from './components/Icons'

const ALL_UNITS = [
  ...[ { label: 'Unit 1', slice: [0,11] }, { label: 'Unit 2', slice: [11,16] }, { label: 'Unit 3', slice: [16,27] }, { label: 'Unit 4', slice: [27,35] }, { label: 'Unit 5', slice: [35,43] }, { label: 'Unit 6', slice: [43,54] } ].map(u => ({ bookName: '三年级上册', bookId: 'grade3_up', data: grade3UpData, ...u, label: `三年级上册 · ${u.label}` })),
  ...[ { label: 'Unit 1', slice: [0,13] }, { label: 'Unit 2', slice: [13,19] }, { label: 'Unit 3', slice: [19,27] }, { label: 'Unit 4', slice: [27,31] }, { label: 'Unit 5', slice: [31,35] }, { label: 'Unit 6', slice: [35,43] } ].map(u => ({ bookName: '三年级下册', bookId: 'grade3_down', data: grade3DownData, ...u, label: `三年级下册 · ${u.label}` })),
  ...[ { label: 'Unit 1A', slice: [0,9] }, { label: 'Unit 1B', slice: [9,18] }, { label: 'Unit 1C', slice: [18,26] }, { label: 'Unit 2A', slice: [26,36] }, { label: 'Unit 2B', slice: [36,47] }, { label: 'Unit 3', slice: [47,56] }, { label: 'Unit 4', slice: [56,67] }, { label: 'Unit 5', slice: [67,80] }, { label: 'Unit 6A', slice: [80,89] }, { label: 'Unit 6B', slice: [89,97] } ].map(u => ({ bookName: '四年级上册', bookId: 'grade4_up', data: grade4UpData, ...u, label: `四年级上册 · ${u.label}` })),
  ...[ { label: 'Unit 1A', slice: [0,10] }, { label: 'Unit 1B', slice: [10,20] }, { label: 'Unit 1C', slice: [20,30] }, { label: 'Unit 2A', slice: [30,41] }, { label: 'Unit 2B', slice: [41,51] }, { label: 'Unit 2C', slice: [51,62] }, { label: 'Unit 3A', slice: [62,72] }, { label: 'Unit 3B', slice: [72,81] }, { label: 'Unit 3C', slice: [81,90] }, { label: 'Unit 4A', slice: [90,99] }, { label: 'Unit 4B', slice: [99,108] }, { label: 'Unit 4C', slice: [108,116] }, { label: 'Unit 5A', slice: [116,123] }, { label: 'Unit 5B', slice: [123,129] }, { label: 'Unit 5C', slice: [129,135] }, { label: 'Unit 6A', slice: [135,145] }, { label: 'Unit 6B', slice: [145,155] }, { label: 'Unit 6C', slice: [155,164] } ].map(u => ({ bookName: '四年级下册', bookId: 'grade4_down', data: grade4DownData, ...u, label: `四年级下册 · ${u.label}` })),
  ...[ { label: 'Unit 1', slice: [0,8] }, { label: 'Unit 2', slice: [8,14] }, { label: 'Unit 3', slice: [14,20] }, { label: 'Unit 4', slice: [20,24] }, { label: 'Unit 5', slice: [24,30] }, { label: 'Unit 6', slice: [30,36] } ].map(u => ({ bookName: '五年级上册', bookId: 'grade5_up', data: grade5UpData, ...u, label: `五年级上册 · ${u.label}` })),
  ...[ { label: 'Unit 1', slice: [0,20] }, { label: 'Unit 2', slice: [20,40] }, { label: 'Unit 3', slice: [40,60] }, { label: 'Unit 4', slice: [60,80] }, { label: 'Unit 5', slice: [80,100] }, { label: 'Unit 6', slice: [100,124] } ].map(u => ({ bookName: '五年级下册', bookId: 'grade5_down', data: grade5DownData, ...u, label: `五年级下册 · ${u.label}` })),
  ...[ { label: 'Unit 1', slice: [0,37] }, { label: 'Unit 2', slice: [37,74] }, { label: 'Unit 3', slice: [74,111] }, { label: 'Unit 4', slice: [111,148] }, { label: 'Unit 5', slice: [148,185] }, { label: 'Unit 6', slice: [185,227] } ].map(u => ({ bookName: '六年级上册', bookId: 'grade6_up', data: grade6UpData, ...u, label: `六年级上册 · ${u.label}` })),
  ...[ { label: 'Unit 1', slice: [0,61] }, { label: 'Unit 2', slice: [61,122] }, { label: 'Unit 3', slice: [122,183] }, { label: 'Unit 4', slice: [183,244] } ].map(u => ({ bookName: '六年级下册', bookId: 'grade6_down', data: grade6DownData, ...u, label: `六年级下册 · ${u.label}` })),
  ...(function() {
    function createLessons(data, bookName, bookId) {
      if (!data) return [];
      const out = [];
      let start = 0;
      let unit = String(data[0]?.unit ?? '').trim();
      for (let i = 1; i <= data.length; i++) {
        const nextUnit = i < data.length ? String(data[i]?.unit ?? '').trim() : '';
        if (i === data.length || nextUnit !== unit) {
          const label = unit || '全册';
          const len = i - start;
          const needSplit = len > 10;
          let chunkStart = start;
          let chunkIdx = 0;
          while (chunkStart < i) {
            let chunkEnd = Math.min(chunkStart + 10, i);
            let chunkLabel = needSplit ? `${label}${String.fromCharCode(65 + chunkIdx)}` : label;
            out.push({ bookName, bookId, data, label: `${bookName} · ${chunkLabel}`, slice: [chunkStart, chunkEnd] });
            chunkStart = chunkEnd;
            chunkIdx++;
          }
          start = i;
          if (i < data.length) unit = nextUnit;
        }
      }
      return out;
    }
    return [
      ...createLessons(renai7upData, '七年级上册', 'renai_7up'),
      ...createLessons(renai7downData, '七年级下册', 'renai_7down'),
      ...createLessons(renai8upData, '八年级上册', 'renai_8up'),
      ...createLessons(renai8downData, '八年级下册', 'renai_8down'),
      ...createLessons(renai9upData, '九年级上册', 'renai_9up'),
      ...createLessons(renai9downData, '九年级下册', 'renai_9down'),
    ];
  })(),
  ...[ { label: 'Unit 1A', slice: [0,10] }, { label: 'Unit 1B', slice: [10,20] }, { label: 'Unit 1C', slice: [20,30] }, { label: 'Unit 1D', slice: [30,40] }, { label: 'Unit 1E', slice: [40,50] }, { label: 'Unit 1F', slice: [50,60] }, { label: 'Unit 1G', slice: [60,70] }, { label: 'Unit 1H', slice: [70,80] }, { label: 'Unit 1I', slice: [80,90] }, { label: 'Unit 1J', slice: [90,100] }, { label: 'Unit 1K', slice: [100,110] }, { label: 'Unit 1L', slice: [110,120] }, { label: 'Unit 1M', slice: [120,130] }, { label: 'Unit 1N', slice: [130,140] }, { label: 'Unit 1O', slice: [140,150] }, { label: 'Unit 1P', slice: [150,160] }, { label: 'Unit 1Q', slice: [160,167] }, { label: 'Unit 2A', slice: [167,177] }, { label: 'Unit 2B', slice: [177,187] }, { label: 'Unit 2C', slice: [187,197] }, { label: 'Unit 2D', slice: [197,207] }, { label: 'Unit 2E', slice: [207,217] }, { label: 'Unit 2F', slice: [217,227] }, { label: 'Unit 2G', slice: [227,237] }, { label: 'Unit 2H', slice: [237,247] }, { label: 'Unit 2I', slice: [247,257] }, { label: 'Unit 2J', slice: [257,267] }, { label: 'Unit 2K', slice: [267,277] }, { label: 'Unit 2L', slice: [277,287] }, { label: 'Unit 2M', slice: [287,297] }, { label: 'Unit 2N', slice: [297,307] }, { label: 'Unit 2O', slice: [307,316] }, { label: 'Unit 3A', slice: [316,326] }, { label: 'Unit 3B', slice: [326,336] }, { label: 'Unit 3C', slice: [336,346] }, { label: 'Unit 3D', slice: [346,356] }, { label: 'Unit 3E', slice: [356,366] }, { label: 'Unit 3F', slice: [366,376] }, { label: 'Unit 3G', slice: [376,386] }, { label: 'Unit 3H', slice: [386,396] }, { label: 'Unit 3I', slice: [396,406] }, { label: 'Unit 3J', slice: [406,416] }, { label: 'Unit 3K', slice: [416,426] }, { label: 'Unit 3L', slice: [426,436] }, { label: 'Unit 3M', slice: [436,446] }, { label: 'Unit 3N', slice: [446,456] }, { label: 'Unit 3O', slice: [456,466] }, { label: 'Unit 3P', slice: [466,476] }, { label: 'Unit 3Q', slice: [476,486] }, { label: 'Unit 3R', slice: [486,496] }, { label: 'Unit 3S', slice: [496,506] }, { label: 'Unit 3T', slice: [506,516] }, { label: 'Unit 3U', slice: [516,526] }, { label: 'Unit 3V', slice: [526,536] }, { label: 'Unit 3W', slice: [536,546] }, { label: 'Unit 3X', slice: [546,556] }, { label: 'Unit 3Y', slice: [556,566] }, { label: 'Unit 3Z', slice: [566,576] }, { label: 'Unit 3AA', slice: [576,586] }, { label: 'Unit 3AB', slice: [586,596] }, { label: 'Unit 3AC', slice: [596,606] }, { label: 'Unit 3AD', slice: [606,616] }, { label: 'Unit 3AE', slice: [616,626] }, { label: 'Unit 3AF', slice: [626,636] }, { label: 'Unit 3AG', slice: [636,646] }, { label: 'Unit 3AH', slice: [646,656] }, { label: 'Unit 3AI', slice: [656,666] }, { label: 'Unit 3AJ', slice: [666,676] }, { label: 'Unit 3AK', slice: [676,686] }, { label: 'Unit 3AL', slice: [686,696] }, { label: 'Unit 3AM', slice: [696,706] }, { label: 'Unit 3AN', slice: [706,716] }, { label: 'Unit 3AO', slice: [716,726] }, { label: 'Unit 3AP', slice: [726,736] }, { label: 'Unit 3AQ', slice: [736,746] }, { label: 'Unit 3AR', slice: [746,756] }, { label: 'Unit 3AS', slice: [756,766] }, { label: 'Unit 3AT', slice: [766,776] }, { label: 'Unit 3AU', slice: [776,786] }, { label: 'Unit 3AV', slice: [786,796] }, { label: 'Unit 3AW', slice: [796,806] }, { label: 'Unit 3AX', slice: [806,816] }, { label: 'Unit 3AY', slice: [816,826] }, { label: 'Unit 3AZ', slice: [826,836] }, { label: 'Unit 3BA', slice: [836,846] }, { label: 'Unit 3BB', slice: [846,856] }, { label: 'Unit 3BC', slice: [856,857] } ].map(u => ({ bookName: '必修 第一册', bookId: 'bsda_b1', data: bsdaB1Data, ...u, label: `必修 第一册 · ${u.label}` })),
  ...[ { label: 'Unit 1A', slice: [0,10] }, { label: 'Unit 1B', slice: [10,20] }, { label: 'Unit 1C', slice: [20,30] }, { label: 'Unit 1D', slice: [30,40] }, { label: 'Unit 1E', slice: [40,50] }, { label: 'Unit 1F', slice: [50,60] }, { label: 'Unit 1G', slice: [60,70] }, { label: 'Unit 1H', slice: [70,80] }, { label: 'Unit 1I', slice: [80,90] }, { label: 'Unit 1J', slice: [90,100] }, { label: 'Unit 1K', slice: [100,110] }, { label: 'Unit 1L', slice: [110,120] }, { label: 'Unit 1M', slice: [120,130] }, { label: 'Unit 1N', slice: [130,140] }, { label: 'Unit 1O', slice: [140,150] }, { label: 'Unit 2A', slice: [150,160] }, { label: 'Unit 2B', slice: [160,170] }, { label: 'Unit 2C', slice: [170,180] }, { label: 'Unit 2D', slice: [180,190] }, { label: 'Unit 2E', slice: [190,200] }, { label: 'Unit 2F', slice: [200,210] }, { label: 'Unit 2G', slice: [210,220] }, { label: 'Unit 2H', slice: [220,230] }, { label: 'Unit 2I', slice: [230,240] }, { label: 'Unit 2J', slice: [240,250] }, { label: 'Unit 2K', slice: [250,260] }, { label: 'Unit 2L', slice: [260,270] }, { label: 'Unit 2M', slice: [270,280] }, { label: 'Unit 2N', slice: [280,290] }, { label: 'Unit 2O', slice: [290,300] }, { label: 'Unit 2P', slice: [300,310] }, { label: 'Unit 2Q', slice: [310,320] }, { label: 'Unit 2R', slice: [320,330] }, { label: 'Unit 2S', slice: [330,337] }, { label: 'Unit 3A', slice: [337,347] }, { label: 'Unit 3B', slice: [347,357] }, { label: 'Unit 3C', slice: [357,367] }, { label: 'Unit 3D', slice: [367,377] }, { label: 'Unit 3E', slice: [377,387] }, { label: 'Unit 3F', slice: [387,397] }, { label: 'Unit 3G', slice: [397,407] }, { label: 'Unit 3H', slice: [407,417] }, { label: 'Unit 3I', slice: [417,427] }, { label: 'Unit 3J', slice: [427,437] }, { label: 'Unit 3K', slice: [437,447] }, { label: 'Unit 3L', slice: [447,457] }, { label: 'Unit 3M', slice: [457,467] }, { label: 'Unit 3N', slice: [467,477] }, { label: 'Unit 3O', slice: [477,487] }, { label: 'Unit 3P', slice: [487,497] }, { label: 'Unit 3Q', slice: [497,507] }, { label: 'Unit 3R', slice: [507,517] }, { label: 'Unit 3S', slice: [517,527] }, { label: 'Unit 3T', slice: [527,537] }, { label: 'Unit 3U', slice: [537,547] }, { label: 'Unit 3V', slice: [547,557] }, { label: 'Unit 3W', slice: [557,567] }, { label: 'Unit 3X', slice: [567,577] }, { label: 'Unit 3Y', slice: [577,587] }, { label: 'Unit 3Z', slice: [587,597] }, { label: 'Unit 3AA', slice: [597,607] }, { label: 'Unit 3AB', slice: [607,617] }, { label: 'Unit 3AC', slice: [617,627] }, { label: 'Unit 3AD', slice: [627,637] }, { label: 'Unit 3AE', slice: [637,647] }, { label: 'Unit 3AF', slice: [647,657] }, { label: 'Unit 3AG', slice: [657,667] }, { label: 'Unit 3AH', slice: [667,677] }, { label: 'Unit 3AI', slice: [677,687] }, { label: 'Unit 3AJ', slice: [687,697] }, { label: 'Unit 3AK', slice: [697,707] }, { label: 'Unit 3AL', slice: [707,717] }, { label: 'Unit 3AM', slice: [717,727] }, { label: 'Unit 3AN', slice: [727,737] }, { label: 'Unit 3AO', slice: [737,747] }, { label: 'Unit 3AP', slice: [747,757] }, { label: 'Unit 3AQ', slice: [757,767] }, { label: 'Unit 3AR', slice: [767,777] }, { label: 'Unit 3AS', slice: [777,787] }, { label: 'Unit 3AT', slice: [787,797] }, { label: 'Unit 3AU', slice: [797,807] }, { label: 'Unit 3AV', slice: [807,817] }, { label: 'Unit 3AW', slice: [817,827] }, { label: 'Unit 3AX', slice: [827,837] }, { label: 'Unit 3AY', slice: [837,847] }, { label: 'Unit 3AZ', slice: [847,857] }, { label: 'Unit 3BA', slice: [857,867] }, { label: 'Unit 3BB', slice: [867,877] }, { label: 'Unit 3BC', slice: [877,887] }, { label: 'Unit 3BD', slice: [887,897] }, { label: 'Unit 3BE', slice: [897,907] }, { label: 'Unit 3BF', slice: [907,917] }, { label: 'Unit 3BG', slice: [917,927] }, { label: 'Unit 3BH', slice: [927,937] }, { label: 'Unit 3BI', slice: [937,947] }, { label: 'Unit 3BJ', slice: [947,957] }, { label: 'Unit 3BK', slice: [957,958] } ].map(u => ({ bookName: '必修 第二册', bookId: 'bsda_b2', data: bsdaB2Data, ...u, label: `必修 第二册 · ${u.label}` })),
  ...[ { label: 'Unit 1A', slice: [0,10] }, { label: 'Unit 1B', slice: [10,20] }, { label: 'Unit 1C', slice: [20,30] }, { label: 'Unit 1D', slice: [30,40] }, { label: 'Unit 1E', slice: [40,50] }, { label: 'Unit 1F', slice: [50,60] }, { label: 'Unit 1G', slice: [60,70] }, { label: 'Unit 1H', slice: [70,80] }, { label: 'Unit 1I', slice: [80,90] }, { label: 'Unit 1J', slice: [90,100] }, { label: 'Unit 1K', slice: [100,110] }, { label: 'Unit 1L', slice: [110,120] }, { label: 'Unit 1M', slice: [120,130] }, { label: 'Unit 1N', slice: [130,140] }, { label: 'Unit 1O', slice: [140,150] }, { label: 'Unit 1P', slice: [150,152] }, { label: 'Unit 2A', slice: [152,162] }, { label: 'Unit 2B', slice: [162,172] }, { label: 'Unit 2C', slice: [172,182] }, { label: 'Unit 2D', slice: [182,192] }, { label: 'Unit 2E', slice: [192,202] }, { label: 'Unit 2F', slice: [202,212] }, { label: 'Unit 2G', slice: [212,222] }, { label: 'Unit 2H', slice: [222,232] }, { label: 'Unit 2I', slice: [232,242] }, { label: 'Unit 2J', slice: [242,252] }, { label: 'Unit 2K', slice: [252,262] }, { label: 'Unit 2L', slice: [262,272] }, { label: 'Unit 2M', slice: [272,282] }, { label: 'Unit 2N', slice: [282,292] }, { label: 'Unit 2O', slice: [292,302] }, { label: 'Unit 2P', slice: [302,312] }, { label: 'Unit 2Q', slice: [312,313] }, { label: 'Unit 3A', slice: [313,323] }, { label: 'Unit 3B', slice: [323,333] }, { label: 'Unit 3C', slice: [333,343] }, { label: 'Unit 3D', slice: [343,353] }, { label: 'Unit 3E', slice: [353,363] }, { label: 'Unit 3F', slice: [363,373] }, { label: 'Unit 3G', slice: [373,383] }, { label: 'Unit 3H', slice: [383,393] }, { label: 'Unit 3I', slice: [393,403] }, { label: 'Unit 3J', slice: [403,413] }, { label: 'Unit 3K', slice: [413,423] }, { label: 'Unit 3L', slice: [423,433] }, { label: 'Unit 3M', slice: [433,443] }, { label: 'Unit 3N', slice: [443,453] }, { label: 'Unit 3O', slice: [453,463] }, { label: 'Unit 3P', slice: [463,473] }, { label: 'Unit 3Q', slice: [473,483] }, { label: 'Unit 3R', slice: [483,493] }, { label: 'Unit 3S', slice: [493,503] }, { label: 'Unit 3T', slice: [503,513] }, { label: 'Unit 3U', slice: [513,523] }, { label: 'Unit 3V', slice: [523,533] }, { label: 'Unit 3W', slice: [533,543] }, { label: 'Unit 3X', slice: [543,553] }, { label: 'Unit 3Y', slice: [553,563] }, { label: 'Unit 3Z', slice: [563,573] }, { label: 'Unit 3AA', slice: [573,583] }, { label: 'Unit 3AB', slice: [583,593] }, { label: 'Unit 3AC', slice: [593,603] }, { label: 'Unit 3AD', slice: [603,613] }, { label: 'Unit 3AE', slice: [613,623] }, { label: 'Unit 3AF', slice: [623,633] }, { label: 'Unit 3AG', slice: [633,643] }, { label: 'Unit 3AH', slice: [643,653] }, { label: 'Unit 3AI', slice: [653,663] }, { label: 'Unit 3AJ', slice: [663,673] }, { label: 'Unit 3AK', slice: [673,683] }, { label: 'Unit 3AL', slice: [683,693] }, { label: 'Unit 3AM', slice: [693,703] }, { label: 'Unit 3AN', slice: [703,713] }, { label: 'Unit 3AO', slice: [713,723] }, { label: 'Unit 3AP', slice: [723,733] }, { label: 'Unit 3AQ', slice: [733,743] }, { label: 'Unit 3AR', slice: [743,753] }, { label: 'Unit 3AS', slice: [753,763] }, { label: 'Unit 3AT', slice: [763,773] }, { label: 'Unit 3AU', slice: [773,783] }, { label: 'Unit 3AV', slice: [783,793] }, { label: 'Unit 3AW', slice: [793,803] }, { label: 'Unit 3AX', slice: [803,813] }, { label: 'Unit 3AY', slice: [813,823] }, { label: 'Unit 3AZ', slice: [823,833] }, { label: 'Unit 3BA', slice: [833,843] }, { label: 'Unit 3BB', slice: [843,853] }, { label: 'Unit 3BC', slice: [853,863] }, { label: 'Unit 3BD', slice: [863,873] }, { label: 'Unit 3BE', slice: [873,883] }, { label: 'Unit 3BF', slice: [883,893] }, { label: 'Unit 3BG', slice: [893,903] }, { label: 'Unit 3BH', slice: [903,908] } ].map(u => ({ bookName: '必修 第三册', bookId: 'bsda_b3', data: bsdaB3Data, ...u, label: `必修 第三册 · ${u.label}` })),
  ...[ { label: 'Unit 1A', slice: [0,10] }, { label: 'Unit 1B', slice: [10,20] }, { label: 'Unit 1C', slice: [20,30] }, { label: 'Unit 1D', slice: [30,40] }, { label: 'Unit 1E', slice: [40,50] }, { label: 'Unit 1F', slice: [50,60] }, { label: 'Unit 1G', slice: [60,70] }, { label: 'Unit 1H', slice: [70,80] }, { label: 'Unit 1I', slice: [80,90] }, { label: 'Unit 1J', slice: [90,100] }, { label: 'Unit 1K', slice: [100,110] }, { label: 'Unit 1L', slice: [110,120] }, { label: 'Unit 1M', slice: [120,130] }, { label: 'Unit 1N', slice: [130,140] }, { label: 'Unit 1O', slice: [140,150] }, { label: 'Unit 1P', slice: [150,160] }, { label: 'Unit 1Q', slice: [160,170] }, { label: 'Unit 1R', slice: [170,180] }, { label: 'Unit 1S', slice: [180,190] }, { label: 'Unit 2A', slice: [190,200] }, { label: 'Unit 2B', slice: [200,210] }, { label: 'Unit 2C', slice: [210,220] }, { label: 'Unit 2D', slice: [220,230] }, { label: 'Unit 2E', slice: [230,240] }, { label: 'Unit 2F', slice: [240,250] }, { label: 'Unit 2G', slice: [250,260] }, { label: 'Unit 2H', slice: [260,270] }, { label: 'Unit 2I', slice: [270,280] }, { label: 'Unit 2J', slice: [280,290] }, { label: 'Unit 2K', slice: [290,300] }, { label: 'Unit 2L', slice: [300,310] }, { label: 'Unit 2M', slice: [310,320] }, { label: 'Unit 2N', slice: [320,330] }, { label: 'Unit 2O', slice: [330,340] }, { label: 'Unit 2P', slice: [340,350] }, { label: 'Unit 2Q', slice: [350,360] }, { label: 'Unit 2R', slice: [360,370] }, { label: 'Unit 2S', slice: [370,380] }, { label: 'Unit 2T', slice: [380,390] }, { label: 'Unit 2U', slice: [390,400] }, { label: 'Unit 2V', slice: [400,410] }, { label: 'Unit 2W', slice: [410,420] }, { label: 'Unit 2X', slice: [420,430] }, { label: 'Unit 2Y', slice: [430,440] }, { label: 'Unit 2Z', slice: [440,450] }, { label: 'Unit 2AA', slice: [450,460] }, { label: 'Unit 2AB', slice: [460,470] }, { label: 'Unit 2AC', slice: [470,480] }, { label: 'Unit 2AD', slice: [480,490] }, { label: 'Unit 2AE', slice: [490,500] }, { label: 'Unit 2AF', slice: [500,510] }, { label: 'Unit 2AG', slice: [510,520] }, { label: 'Unit 2AH', slice: [520,530] }, { label: 'Unit 2AI', slice: [530,540] }, { label: 'Unit 2AJ', slice: [540,550] }, { label: 'Unit 2AK', slice: [550,560] }, { label: 'Unit 2AL', slice: [560,570] }, { label: 'Unit 2AM', slice: [570,580] }, { label: 'Unit 2AN', slice: [580,590] }, { label: 'Unit 2AO', slice: [590,600] }, { label: 'Unit 2AP', slice: [600,610] }, { label: 'Unit 2AQ', slice: [610,620] }, { label: 'Unit 2AR', slice: [620,630] }, { label: 'Unit 2AS', slice: [630,640] }, { label: 'Unit 2AT', slice: [640,650] }, { label: 'Unit 2AU', slice: [650,660] }, { label: 'Unit 2AV', slice: [660,670] }, { label: 'Unit 2AW', slice: [670,680] }, { label: 'Unit 2AX', slice: [680,690] }, { label: 'Unit 2AY', slice: [690,700] }, { label: 'Unit 2AZ', slice: [700,710] }, { label: 'Unit 2BA', slice: [710,720] }, { label: 'Unit 2BB', slice: [720,730] }, { label: 'Unit 2BC', slice: [730,740] }, { label: 'Unit 2BD', slice: [740,750] }, { label: 'Unit 2BE', slice: [750,760] }, { label: 'Unit 2BF', slice: [760,770] }, { label: 'Unit 2BG', slice: [770,780] }, { label: 'Unit 2BH', slice: [780,790] }, { label: 'Unit 2BI', slice: [790,800] }, { label: 'Unit 2BJ', slice: [800,810] }, { label: 'Unit 2BK', slice: [810,820] }, { label: 'Unit 2BL', slice: [820,830] }, { label: 'Unit 2BM', slice: [830,840] }, { label: 'Unit 2BN', slice: [840,850] }, { label: 'Unit 2BO', slice: [850,860] }, { label: 'Unit 2BP', slice: [860,870] }, { label: 'Unit 2BQ', slice: [870,880] }, { label: 'Unit 2BR', slice: [880,890] }, { label: 'Unit 2BS', slice: [890,900] }, { label: 'Unit 2BT', slice: [900,910] }, { label: 'Unit 2BU', slice: [910,920] }, { label: 'Unit 2BV', slice: [920,930] }, { label: 'Unit 2BW', slice: [930,940] }, { label: 'Unit 2BX', slice: [940,950] }, { label: 'Unit 2BY', slice: [950,960] }, { label: 'Unit 2BZ', slice: [960,970] }, { label: 'Unit 2CA', slice: [970,980] }, { label: 'Unit 2CB', slice: [980,990] }, { label: 'Unit 2CC', slice: [990,1000] }, { label: 'Unit 2CD', slice: [1000,1010] }, { label: 'Unit 2CE', slice: [1010,1020] }, { label: 'Unit 2CF', slice: [1020,1023] } ].map(u => ({ bookName: '选择性必修 第一册', bookId: 'bsda_s1', data: bsdaS1Data, ...u, label: `选择性必修 第一册 · ${u.label}` })),
  ...[ { label: 'Unit 1A', slice: [0,10] }, { label: 'Unit 1B', slice: [10,20] }, { label: 'Unit 1C', slice: [20,30] }, { label: 'Unit 1D', slice: [30,40] }, { label: 'Unit 1E', slice: [40,50] }, { label: 'Unit 1F', slice: [50,60] }, { label: 'Unit 1G', slice: [60,70] }, { label: 'Unit 1H', slice: [70,80] }, { label: 'Unit 1I', slice: [80,90] }, { label: 'Unit 1J', slice: [90,100] }, { label: 'Unit 1K', slice: [100,110] }, { label: 'Unit 1L', slice: [110,120] }, { label: 'Unit 1M', slice: [120,130] }, { label: 'Unit 1N', slice: [130,140] }, { label: 'Unit 1O', slice: [140,150] }, { label: 'Unit 1P', slice: [150,160] }, { label: 'Unit 1Q', slice: [160,170] }, { label: 'Unit 1R', slice: [170,180] }, { label: 'Unit 1S', slice: [180,190] }, { label: 'Unit 1T', slice: [190,200] }, { label: 'Unit 1U', slice: [200,210] }, { label: 'Unit 2A', slice: [210,220] }, { label: 'Unit 2B', slice: [220,230] }, { label: 'Unit 2C', slice: [230,240] }, { label: 'Unit 2D', slice: [240,250] }, { label: 'Unit 2E', slice: [250,260] }, { label: 'Unit 2F', slice: [260,270] }, { label: 'Unit 2G', slice: [270,280] }, { label: 'Unit 2H', slice: [280,290] }, { label: 'Unit 2I', slice: [290,300] }, { label: 'Unit 2J', slice: [300,310] }, { label: 'Unit 2K', slice: [310,320] }, { label: 'Unit 2L', slice: [320,330] }, { label: 'Unit 2M', slice: [330,340] }, { label: 'Unit 2N', slice: [340,350] }, { label: 'Unit 2O', slice: [350,360] }, { label: 'Unit 2P', slice: [360,370] }, { label: 'Unit 2Q', slice: [370,380] }, { label: 'Unit 2R', slice: [380,390] }, { label: 'Unit 2S', slice: [390,400] }, { label: 'Unit 2T', slice: [400,401] }, { label: 'Unit 3A', slice: [401,411] }, { label: 'Unit 3B', slice: [411,421] }, { label: 'Unit 3C', slice: [421,431] }, { label: 'Unit 3D', slice: [431,441] }, { label: 'Unit 3E', slice: [441,451] }, { label: 'Unit 3F', slice: [451,461] }, { label: 'Unit 3G', slice: [461,471] }, { label: 'Unit 3H', slice: [471,481] }, { label: 'Unit 3I', slice: [481,491] }, { label: 'Unit 3J', slice: [491,501] }, { label: 'Unit 3K', slice: [501,511] }, { label: 'Unit 3L', slice: [511,521] }, { label: 'Unit 3M', slice: [521,531] }, { label: 'Unit 3N', slice: [531,541] }, { label: 'Unit 3O', slice: [541,551] }, { label: 'Unit 3P', slice: [551,561] }, { label: 'Unit 3Q', slice: [561,571] }, { label: 'Unit 3R', slice: [571,581] }, { label: 'Unit 3S', slice: [581,591] }, { label: 'Unit 3T', slice: [591,601] }, { label: 'Unit 3U', slice: [601,611] }, { label: 'Unit 3V', slice: [611,621] }, { label: 'Unit 3W', slice: [621,631] }, { label: 'Unit 3X', slice: [631,641] }, { label: 'Unit 3Y', slice: [641,651] }, { label: 'Unit 3Z', slice: [651,661] }, { label: 'Unit 3AA', slice: [661,671] }, { label: 'Unit 3AB', slice: [671,681] }, { label: 'Unit 3AC', slice: [681,691] }, { label: 'Unit 3AD', slice: [691,701] }, { label: 'Unit 3AE', slice: [701,711] }, { label: 'Unit 3AF', slice: [711,721] }, { label: 'Unit 3AG', slice: [721,731] }, { label: 'Unit 3AH', slice: [731,741] }, { label: 'Unit 3AI', slice: [741,751] }, { label: 'Unit 3AJ', slice: [751,761] }, { label: 'Unit 3AK', slice: [761,771] }, { label: 'Unit 3AL', slice: [771,781] }, { label: 'Unit 3AM', slice: [781,791] }, { label: 'Unit 3AN', slice: [791,801] }, { label: 'Unit 3AO', slice: [801,811] }, { label: 'Unit 3AP', slice: [811,821] }, { label: 'Unit 3AQ', slice: [821,831] }, { label: 'Unit 3AR', slice: [831,841] }, { label: 'Unit 3AS', slice: [841,851] }, { label: 'Unit 3AT', slice: [851,861] }, { label: 'Unit 3AU', slice: [861,871] }, { label: 'Unit 3AV', slice: [871,881] }, { label: 'Unit 3AW', slice: [881,891] }, { label: 'Unit 3AX', slice: [891,901] }, { label: 'Unit 3AY', slice: [901,911] }, { label: 'Unit 3AZ', slice: [911,921] }, { label: 'Unit 3BA', slice: [921,931] }, { label: 'Unit 3BB', slice: [931,941] }, { label: 'Unit 3BC', slice: [941,951] }, { label: 'Unit 3BD', slice: [951,961] }, { label: 'Unit 3BE', slice: [961,971] }, { label: 'Unit 3BF', slice: [971,981] }, { label: 'Unit 3BG', slice: [981,991] }, { label: 'Unit 3BH', slice: [991,1001] }, { label: 'Unit 3BI', slice: [1001,1011] }, { label: 'Unit 3BJ', slice: [1011,1021] }, { label: 'Unit 3BK', slice: [1021,1031] }, { label: 'Unit 3BL', slice: [1031,1041] }, { label: 'Unit 3BM', slice: [1041,1051] }, { label: 'Unit 3BN', slice: [1051,1061] }, { label: 'Unit 3BO', slice: [1061,1071] }, { label: 'Unit 3BP', slice: [1071,1081] }, { label: 'Unit 3BQ', slice: [1081,1091] }, { label: 'Unit 3BR', slice: [1091,1101] }, { label: 'Unit 3BS', slice: [1101,1106] } ].map(u => ({ bookName: '选择性必修 第二册', bookId: 'bsda_s2', data: bsdaS2Data, ...u, label: `选择性必修 第二册 · ${u.label}` })),
  ...[ { label: 'Unit 1A', slice: [0,10] }, { label: 'Unit 1B', slice: [10,20] }, { label: 'Unit 1C', slice: [20,30] }, { label: 'Unit 1D', slice: [30,40] }, { label: 'Unit 1E', slice: [40,50] }, { label: 'Unit 1F', slice: [50,60] }, { label: 'Unit 1G', slice: [60,70] }, { label: 'Unit 1H', slice: [70,80] }, { label: 'Unit 1I', slice: [80,90] }, { label: 'Unit 1J', slice: [90,100] }, { label: 'Unit 1K', slice: [100,110] }, { label: 'Unit 1L', slice: [110,120] }, { label: 'Unit 1M', slice: [120,130] }, { label: 'Unit 1N', slice: [130,140] }, { label: 'Unit 1O', slice: [140,150] }, { label: 'Unit 1P', slice: [150,159] }, { label: 'Unit 2A', slice: [159,169] }, { label: 'Unit 2B', slice: [169,179] }, { label: 'Unit 2C', slice: [179,189] }, { label: 'Unit 2D', slice: [189,199] }, { label: 'Unit 2E', slice: [199,209] }, { label: 'Unit 2F', slice: [209,219] }, { label: 'Unit 2G', slice: [219,229] }, { label: 'Unit 2H', slice: [229,239] }, { label: 'Unit 2I', slice: [239,249] }, { label: 'Unit 2J', slice: [249,259] }, { label: 'Unit 2K', slice: [259,269] }, { label: 'Unit 2L', slice: [269,279] }, { label: 'Unit 2M', slice: [279,289] }, { label: 'Unit 2N', slice: [289,299] }, { label: 'Unit 2O', slice: [299,309] }, { label: 'Unit 2P', slice: [309,319] }, { label: 'Unit 2Q', slice: [319,329] }, { label: 'Unit 2R', slice: [329,339] }, { label: 'Unit 2S', slice: [339,349] }, { label: 'Unit 2T', slice: [349,359] }, { label: 'Unit 2U', slice: [359,369] }, { label: 'Unit 2V', slice: [369,379] }, { label: 'Unit 2W', slice: [379,389] }, { label: 'Unit 2X', slice: [389,399] }, { label: 'Unit 2Y', slice: [399,409] }, { label: 'Unit 2Z', slice: [409,419] }, { label: 'Unit 2AA', slice: [419,429] }, { label: 'Unit 2AB', slice: [429,439] }, { label: 'Unit 2AC', slice: [439,445] }, { label: 'Unit 3A', slice: [445,455] }, { label: 'Unit 3B', slice: [455,465] }, { label: 'Unit 3C', slice: [465,475] }, { label: 'Unit 3D', slice: [475,485] }, { label: 'Unit 3E', slice: [485,495] }, { label: 'Unit 3F', slice: [495,505] }, { label: 'Unit 3G', slice: [505,515] }, { label: 'Unit 3H', slice: [515,525] }, { label: 'Unit 3I', slice: [525,535] }, { label: 'Unit 3J', slice: [535,545] }, { label: 'Unit 3K', slice: [545,555] }, { label: 'Unit 3L', slice: [555,565] }, { label: 'Unit 3M', slice: [565,575] }, { label: 'Unit 3N', slice: [575,585] }, { label: 'Unit 3O', slice: [585,595] }, { label: 'Unit 3P', slice: [595,605] }, { label: 'Unit 3Q', slice: [605,615] }, { label: 'Unit 3R', slice: [615,625] }, { label: 'Unit 3S', slice: [625,635] }, { label: 'Unit 3T', slice: [635,645] }, { label: 'Unit 3U', slice: [645,655] }, { label: 'Unit 3V', slice: [655,665] }, { label: 'Unit 3W', slice: [665,675] }, { label: 'Unit 3X', slice: [675,685] }, { label: 'Unit 3Y', slice: [685,695] }, { label: 'Unit 3Z', slice: [695,705] }, { label: 'Unit 3AA', slice: [705,715] }, { label: 'Unit 3AB', slice: [715,725] }, { label: 'Unit 3AC', slice: [725,735] }, { label: 'Unit 3AD', slice: [735,745] }, { label: 'Unit 3AE', slice: [745,755] }, { label: 'Unit 3AF', slice: [755,765] }, { label: 'Unit 3AG', slice: [765,775] }, { label: 'Unit 3AH', slice: [775,785] }, { label: 'Unit 3AI', slice: [785,795] }, { label: 'Unit 3AJ', slice: [795,805] }, { label: 'Unit 3AK', slice: [805,815] }, { label: 'Unit 3AL', slice: [815,825] }, { label: 'Unit 3AM', slice: [825,835] }, { label: 'Unit 3AN', slice: [835,845] }, { label: 'Unit 3AO', slice: [845,855] }, { label: 'Unit 3AP', slice: [855,865] }, { label: 'Unit 3AQ', slice: [865,875] }, { label: 'Unit 3AR', slice: [875,885] }, { label: 'Unit 3AS', slice: [885,895] }, { label: 'Unit 3AT', slice: [895,905] }, { label: 'Unit 3AU', slice: [905,915] }, { label: 'Unit 3AV', slice: [915,925] }, { label: 'Unit 3AW', slice: [925,935] }, { label: 'Unit 3AX', slice: [935,945] }, { label: 'Unit 3AY', slice: [945,955] }, { label: 'Unit 3AZ', slice: [955,965] }, { label: 'Unit 3BA', slice: [965,975] }, { label: 'Unit 3BB', slice: [975,985] }, { label: 'Unit 3BC', slice: [985,995] }, { label: 'Unit 3BD', slice: [995,1005] }, { label: 'Unit 3BE', slice: [1005,1015] }, { label: 'Unit 3BF', slice: [1015,1025] }, { label: 'Unit 3BG', slice: [1025,1035] }, { label: 'Unit 3BH', slice: [1035,1045] }, { label: 'Unit 3BI', slice: [1045,1055] }, { label: 'Unit 3BJ', slice: [1055,1065] }, { label: 'Unit 3BK', slice: [1065,1075] }, { label: 'Unit 3BL', slice: [1075,1085] }, { label: 'Unit 3BM', slice: [1085,1095] }, { label: 'Unit 3BN', slice: [1095,1105] }, { label: 'Unit 3BO', slice: [1105,1115] }, { label: 'Unit 3BP', slice: [1115,1125] }, { label: 'Unit 3BQ', slice: [1125,1135] }, { label: 'Unit 3BR', slice: [1135,1145] }, { label: 'Unit 3BS', slice: [1145,1151] } ].map(u => ({ bookName: '选择性必修 第三册', bookId: 'bsda_s3', data: bsdaS3Data, ...u, label: `选择性必修 第三册 · ${u.label}` })),
  ...[ { label: 'Unit 1A', slice: [0,10] }, { label: 'Unit 1B', slice: [10,20] }, { label: 'Unit 1C', slice: [20,30] }, { label: 'Unit 1D', slice: [30,40] }, { label: 'Unit 1E', slice: [40,50] }, { label: 'Unit 1F', slice: [50,60] }, { label: 'Unit 1G', slice: [60,70] }, { label: 'Unit 1H', slice: [70,80] }, { label: 'Unit 1I', slice: [80,90] }, { label: 'Unit 1J', slice: [90,100] }, { label: 'Unit 1K', slice: [100,110] }, { label: 'Unit 1L', slice: [110,120] }, { label: 'Unit 1M', slice: [120,130] }, { label: 'Unit 1N', slice: [130,140] }, { label: 'Unit 1O', slice: [140,150] }, { label: 'Unit 1P', slice: [150,160] }, { label: 'Unit 1Q', slice: [160,170] }, { label: 'Unit 1R', slice: [170,180] }, { label: 'Unit 1S', slice: [180,190] }, { label: 'Unit 1T', slice: [190,200] }, { label: 'Unit 1U', slice: [200,210] }, { label: 'Unit 1V', slice: [210,220] }, { label: 'Unit 1W', slice: [220,230] }, { label: 'Unit 1X', slice: [230,240] }, { label: 'Unit 1Y', slice: [240,250] }, { label: 'Unit 1Z', slice: [250,260] }, { label: 'Unit 1AA', slice: [260,268] }, { label: 'Unit 2A', slice: [268,278] }, { label: 'Unit 2B', slice: [278,288] }, { label: 'Unit 2C', slice: [288,298] }, { label: 'Unit 2D', slice: [298,308] }, { label: 'Unit 2E', slice: [308,318] }, { label: 'Unit 2F', slice: [318,328] }, { label: 'Unit 2G', slice: [328,338] }, { label: 'Unit 2H', slice: [338,348] }, { label: 'Unit 2I', slice: [348,358] }, { label: 'Unit 2J', slice: [358,368] }, { label: 'Unit 2K', slice: [368,378] }, { label: 'Unit 2L', slice: [378,388] }, { label: 'Unit 2M', slice: [388,398] }, { label: 'Unit 2N', slice: [398,408] }, { label: 'Unit 2O', slice: [408,418] }, { label: 'Unit 2P', slice: [418,428] }, { label: 'Unit 2Q', slice: [428,438] }, { label: 'Unit 2R', slice: [438,448] }, { label: 'Unit 2S', slice: [448,458] }, { label: 'Unit 2T', slice: [458,468] }, { label: 'Unit 2U', slice: [468,478] }, { label: 'Unit 2V', slice: [478,486] }, { label: 'Unit 3A', slice: [486,496] }, { label: 'Unit 3B', slice: [496,506] }, { label: 'Unit 3C', slice: [506,516] }, { label: 'Unit 3D', slice: [516,526] }, { label: 'Unit 3E', slice: [526,536] }, { label: 'Unit 3F', slice: [536,546] }, { label: 'Unit 3G', slice: [546,556] }, { label: 'Unit 3H', slice: [556,566] }, { label: 'Unit 3I', slice: [566,576] }, { label: 'Unit 3J', slice: [576,586] }, { label: 'Unit 3K', slice: [586,596] }, { label: 'Unit 3L', slice: [596,606] }, { label: 'Unit 3M', slice: [606,616] }, { label: 'Unit 3N', slice: [616,626] }, { label: 'Unit 3O', slice: [626,636] }, { label: 'Unit 3P', slice: [636,646] }, { label: 'Unit 3Q', slice: [646,656] }, { label: 'Unit 3R', slice: [656,666] }, { label: 'Unit 3S', slice: [666,676] }, { label: 'Unit 3T', slice: [676,686] }, { label: 'Unit 3U', slice: [686,696] }, { label: 'Unit 3V', slice: [696,706] }, { label: 'Unit 3W', slice: [706,716] }, { label: 'Unit 3X', slice: [716,726] }, { label: 'Unit 3Y', slice: [726,736] }, { label: 'Unit 3Z', slice: [736,746] }, { label: 'Unit 3AA', slice: [746,756] }, { label: 'Unit 3AB', slice: [756,766] }, { label: 'Unit 3AC', slice: [766,776] }, { label: 'Unit 3AD', slice: [776,786] }, { label: 'Unit 3AE', slice: [786,796] }, { label: 'Unit 3AF', slice: [796,806] }, { label: 'Unit 3AG', slice: [806,816] }, { label: 'Unit 3AH', slice: [816,826] }, { label: 'Unit 3AI', slice: [826,836] }, { label: 'Unit 3AJ', slice: [836,846] }, { label: 'Unit 3AK', slice: [846,856] }, { label: 'Unit 3AL', slice: [856,866] }, { label: 'Unit 3AM', slice: [866,876] }, { label: 'Unit 3AN', slice: [876,886] }, { label: 'Unit 3AO', slice: [886,896] }, { label: 'Unit 3AP', slice: [896,906] }, { label: 'Unit 3AQ', slice: [906,916] }, { label: 'Unit 3AR', slice: [916,926] }, { label: 'Unit 3AS', slice: [926,936] }, { label: 'Unit 3AT', slice: [936,946] }, { label: 'Unit 3AU', slice: [946,956] }, { label: 'Unit 3AV', slice: [956,966] }, { label: 'Unit 3AW', slice: [966,976] }, { label: 'Unit 3AX', slice: [976,986] }, { label: 'Unit 3AY', slice: [986,996] }, { label: 'Unit 3AZ', slice: [996,1006] }, { label: 'Unit 3BA', slice: [1006,1016] }, { label: 'Unit 3BB', slice: [1016,1026] }, { label: 'Unit 3BC', slice: [1026,1036] }, { label: 'Unit 3BD', slice: [1036,1046] }, { label: 'Unit 3BE', slice: [1046,1056] }, { label: 'Unit 3BF', slice: [1056,1066] }, { label: 'Unit 3BG', slice: [1066,1076] }, { label: 'Unit 3BH', slice: [1076,1086] }, { label: 'Unit 3BI', slice: [1086,1096] }, { label: 'Unit 3BJ', slice: [1096,1106] }, { label: 'Unit 3BK', slice: [1106,1116] }, { label: 'Unit 3BL', slice: [1116,1126] }, { label: 'Unit 3BM', slice: [1126,1136] }, { label: 'Unit 3BN', slice: [1136,1146] }, { label: 'Unit 3BO', slice: [1146,1156] }, { label: 'Unit 3BP', slice: [1156,1166] }, { label: 'Unit 3BQ', slice: [1166,1176] }, { label: 'Unit 3BR', slice: [1176,1185] } ].map(u => ({ bookName: '选择性必修 第四册', bookId: 'bsda_s4', data: bsdaS4Data, ...u, label: `选择性必修 第四册 · ${u.label}` })),
]

const STUDY_TIME_KEY = 'english_study_time'
const LESSON_HISTORY_KEY = 'english_lesson_history'

async function saveStudyTime(seconds, userId) {
  const today = new Date().toISOString().slice(0, 10)
  // 本地
  try {
    const data = JSON.parse(localStorage.getItem(STUDY_TIME_KEY) || '{}')
    data[today] = (data[today] || 0) + seconds
    localStorage.setItem(STUDY_TIME_KEY, JSON.stringify(data))
  } catch {}
  // 云端（upsert：当天已有记录则累加）
  if (userId) {
    const { data: existing } = await supabase
      .from('study_sessions')
      .select('seconds')
      .eq('user_id', userId)
      .eq('date', today)
      .single()
    const total = (existing?.seconds || 0) + seconds
    await supabase.from('study_sessions').upsert(
      { user_id: userId, date: today, seconds: total },
      { onConflict: 'user_id,date' }
    )
  }
}

function loadLessonHistory() {
  try { return JSON.parse(localStorage.getItem(LESSON_HISTORY_KEY) || '[]') } catch { return [] }
}

function saveLessonHistory(label, sentences) {
  const history = loadLessonHistory()
  // Remove duplicate label then prepend
  const filtered = history.filter(h => h.label !== label)
  filtered.unshift({ label, count: sentences.length, ts: Date.now() })
  if (filtered.length > 20) filtered.splice(20)
  localStorage.setItem(LESSON_HISTORY_KEY, JSON.stringify(filtered))
}

const SETTINGS_KEY = 'english_input_settings'
const DEFAULT_SETTINGS = {
  lang: 'en-US',
  rate: 1.0,
  ttsEngine: 'hybrid',
  edgeVoice: 'en-US-AvaNeural',
  sentenceSpeak: true,
  autoSpeak: false,
  wordSpeak: true,
  learningLevel: 2,
  showHintOnError: true,
  hintTriggerCount: 1,
  splitMode: false,
  soundEnabled: true,
  keypressSound: 'black-pbt',
  correctSound: 'chime',
  victorySound: 'chime',
  errorSound: 'buzz',
  /** 输入学习：全局领读遍数 1–5（持久化，所有练习框共用） */
  leadReadCount: 1,
}

function loadSettings() {
  try {
    const stored = JSON.parse(localStorage.getItem(SETTINGS_KEY) || 'null')
    return stored ? { ...DEFAULT_SETTINGS, ...stored } : { ...DEFAULT_SETTINGS }
  } catch {
    return { ...DEFAULT_SETTINGS }
  }
}

const NAV_ITEMS = [
  { id: 'home',     Icon: IconHome,           label: '首页' },
  { id: 'exercise', Icon: IconPencil,          label: '练习' },
  { id: 'courses',  Icon: IconBookOpen,        label: '课程广场' },
  { id: 'textbook', Icon: IconBook,            label: '教材同步' },
  { id: 'grammar',  Icon: IconGraduationCap,   label: '语法专项' },
  { id: 'quiz',     Icon: IconCheckSquare,     label: '选择题' },
  { id: 'fillblank', Icon: IconEdit,           label: '填空题' },
]

const BOTTOM_ITEMS = [
  { id: 'wordbank',  Icon: IconArchive,  label: '单词仓库',  disabled: true },
  { id: 'plan',      Icon: IconCalendar, label: '学习计划',  disabled: true },
  { id: 'favorites', Icon: IconStar,     label: '我的收藏',  disabled: true },
  { id: 'sync',      Icon: IconRefresh,  label: '云端同步',  disabled: true },
  { id: 'member',    Icon: IconCrown,    label: '开通会员',  yellow: true },
]

function LoginModal({ onClose, onLogin, initialInviteCode = '' }) {
  useHistoryLayer(true, onClose)
  const [mode, setMode] = useState(initialInviteCode ? 'register' : 'login')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [inviteCode, setInviteCode] = useState(initialInviteCode)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  // 从 URL ?ref= 或 localStorage 读取推荐码
  const [refCode] = useState(() => {
    const urlRef = new URLSearchParams(window.location.search).get('ref')
    if (urlRef) { localStorage.setItem('pending_ref_code', urlRef.toUpperCase()); return urlRef.toUpperCase() }
    return localStorage.getItem('pending_ref_code') || ''
  })

  function reset() { setError(''); setSuccess('') }

  async function handleSubmit() {
    if (!username.trim() || !password) {
      setError('请输入用户名和密码')
      return
    }
    setLoading(true); reset()
    try {
      const path = mode === 'register' ? '/register' : '/login'
      const body = { username, password }
      if (mode === 'register' && refCode) body.ref_code = refCode
      if (mode === 'register' && inviteCode.trim()) body.invite_code = inviteCode.trim().toUpperCase()
      const res = await apiPost(path, body)
      if (res.error) {
        setError(res.error)
      } else {
        if (mode === 'register') localStorage.removeItem('pending_ref_code')
        onLogin(res.username, res.token, res.is_member, res.is_founder)
        onClose()
      }
    } catch {
      setError('登录失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  const titles = { login: '登录', register: '注册账号' }

  return (
    <div className="fixed inset-0 z-[10001] flex items-center justify-center bg-black/70 px-4" onClick={onClose}>
      <CloseBadge onClose={onClose} />
      <div className="bg-gray-900 border border-gray-700 rounded-2xl p-8 w-full max-w-sm shadow-2xl" onClick={e => e.stopPropagation()}>
        <h2 className="text-xl font-bold text-white mb-1">{titles[mode]}</h2>
        <p className="text-gray-500 text-sm mb-6">登录以同步学习进度到云端</p>
        {mode === 'register' && refCode && (
          <div className="bg-green-900/30 border border-green-700/50 rounded-xl px-3 py-2 mb-3 flex items-center gap-2">
            <span className="text-green-400 text-xs">🎁 通过推荐链接注册，推荐码：</span>
            <span className="font-mono text-green-300 font-bold text-sm">{refCode}</span>
          </div>
        )}
        <input
          type="text"
          placeholder="用户名（2-20个字符）"
          value={username}
          onChange={e => setUsername(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm mb-3 outline-none focus:border-blue-500 transition-colors"
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />
        <input
          type="password"
          placeholder="密码（至少6位）"
          value={password}
          onChange={e => setPassword(e.target.value)}
          className="w-full bg-gray-800 border border-gray-700 rounded-xl px-4 py-3 text-white text-sm mb-3 outline-none focus:border-blue-500 transition-colors"
          onKeyDown={e => e.key === 'Enter' && handleSubmit()}
        />
        {mode === 'register' && (
          <input
            type="text"
            placeholder="创始会员邀请码（选填，格式 FD-XXXXXXXX）"
            value={inviteCode}
            onChange={e => setInviteCode(e.target.value)}
            className={`w-full border rounded-xl px-4 py-3 text-sm mb-4 outline-none transition-colors
              ${inviteCode ? 'bg-amber-950/40 border-amber-600/60 text-amber-300 focus:border-amber-400' : 'bg-gray-800 border-gray-700 text-white focus:border-blue-500'}`}
          />
        )}
        {mode !== 'register' && <div className="mb-1" />}
        {error && <p className="text-red-400 text-xs mb-3">{error}</p>}
        {success && <p className="text-green-400 text-xs mb-3">{success}</p>}

        {/* 登录 / 注册 双按钮组（中间细缝分隔，视觉一体） */}
        <div className="flex rounded-xl overflow-hidden shadow-lg mb-3 ring-1 ring-white/10">
          <button
            onClick={() => {
              if (mode !== 'login') { setMode('login'); reset(); return }
              handleSubmit()
            }}
            disabled={loading}
            className={`flex-1 py-3 font-bold text-sm transition-all disabled:opacity-50
              ${mode === 'login'
                ? 'bg-blue-600 hover:bg-blue-500 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-blue-200'}`}>
            {loading && mode === 'login' ? '请稍候…' : '登 录'}
          </button>
          <div className="w-px bg-slate-950" />
          <button
            onClick={() => {
              if (mode !== 'register') { setMode('register'); reset(); return }
              handleSubmit()
            }}
            disabled={loading}
            className={`flex-1 py-3 font-bold text-sm transition-all disabled:opacity-50
              ${mode === 'register'
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-slate-700 hover:bg-slate-600 text-emerald-200'}`}>
            {loading && mode === 'register' ? '请稍候…' : '注 册'}
          </button>
        </div>
        <p className="text-center text-[11px] text-gray-500 mb-2">
          {mode === 'login' ? '当前：登录模式 · 点右侧切换注册' : '当前：注册模式 · 点左侧切换登录'}
        </p>
        <button className="w-full text-gray-600 hover:text-gray-400 text-sm transition-colors" onClick={onClose}>取消</button>
      </div>
    </div>
  )
}

function MainApp() {
  const [sentences, setSentences] = useState(sampleData)
  const [settings, setSettings] = useState(loadSettings)
  const [tab, setTab] = useState('home')
  const [exerciseIndex, setExerciseIndex] = useState(0)
  const [lessonProgress, setLessonProgress] = useState({ index: 0, total: sampleData.length })
  const [nav, setNav] = useState(null)
  const [currentLesson, setCurrentLesson] = useState(null)
  /** 仅语法专项等传入；关闭 grammarUi 开关时为 null */
  const [lessonPackMeta, setLessonPackMeta] = useState(null)
  const lessonPackMetaRef = useRef(null)
  useEffect(() => {
    lessonPackMetaRef.current = lessonPackMeta
  }, [lessonPackMeta])
  /** 语法专项「同步练习」小题包（与教材 Lesson 底栏同款入口） */
  const [grammarSyncQuiz, setGrammarSyncQuiz] = useState(null)
  /** 核心句群同步练习 */
  const [coreSyncQuiz, setCoreSyncQuiz] = useState(null)
  // History API integration:
  // - lessonRegistryRef: in-memory resolver label → { data, nextLoader } (closures can't be serialized)
  // - historyDepth: number of pushState entries we've added past the initial "home"
  // - isPopStateRef: guard so handleImport/navigateTo don't double-push when called from popstate
  const lessonRegistryRef = useRef(new Map())
  const textbookHistoryRef = useRef({ applyStudy: () => {} })
  const coursesHistoryRef = useRef({ applyStudy: () => {} })
  const syncPracticeNavRef = useRef({ applyStudy: () => {} })
  const [historyDepth, setHistoryDepth] = useState(0)
  const isPopStateRef = useRef(false)
  const [showSettings, setShowSettings] = useState(false)
  const [user, setUser] = useState(() => localStorage.getItem('auth_username') || null)
  const [token, setToken] = useState(() => localStorage.getItem('auth_token') || null)
  const [isMember, setIsMember] = useState(() => localStorage.getItem('auth_is_member') === '1')
  const [isFounder, setIsFounder] = useState(() => localStorage.getItem('auth_is_founder') === '1')
  const [showLogin, setShowLogin] = useState(false)
  const [showStudentJoin, setShowStudentJoin] = useState(false)
  const [studentInfo, setStudentInfo] = useState(() => {
    const sid = localStorage.getItem('student_id')
    if (!sid) return null
    return { studentId: sid, studentName: localStorage.getItem('student_name') || '', classId: localStorage.getItem('student_class_id') || '', className: localStorage.getItem('student_class_name') || '' }
  })
  const { onSentenceDone, onWordDone, forceFlush } = useStudentCheckin()
  const [authLoading, setAuthLoading] = useState(false)
  const [syncStatus, setSyncStatus] = useState('')
  const [showLevelMenu, setShowLevelMenu] = useState(false)
  const [showExerciseHistory, setShowExerciseHistory] = useState(false)
  const [showReview, setShowReview] = useState(false)
  const [reviewData, setReviewData] = useState(null)
  const [showCoursesMenu, setShowCoursesMenu] = useState(false)
  const [syncInitialUnit, setSyncInitialUnit] = useState(null)
  const [showQuizMenu, setShowQuizMenu] = useState(false)
  const [showChineseGuide, setShowChineseGuide] = useState(true)
  const [menuOpen, setMenuOpen] = useState(false)
  const levelButtonRef = useRef(null)

  // 主题模式 — 必须在 navSlide useEffect 之前声明，否则 TDZ
  const [isLightMode, setIsLightMode] = useState(() => localStorage.getItem('theme') !== 'dark')
  function toggleTheme() {
    setIsLightMode(v => {
      const next = !v
      localStorage.setItem('theme', next ? 'light' : 'dark')
      return next
    })
  }

  // ── 滑动高亮（菜单薰衣草玻璃块跟随鼠标） ─────────────────
  const navSlideRef = useRef(null)
  const [navSlidePos, setNavSlidePos] = useState(null)
  const [navActivePos, setNavActivePos] = useState(null)

  function navSlideMetrics(el) {
    if (!el) return null
    return { top: el.offsetTop, h: el.offsetHeight, left: el.offsetLeft, w: el.offsetWidth }
  }

  function navSlideFromEl(el) {
    const metrics = navSlideMetrics(el)
    if (metrics) setNavSlidePos(metrics)
  }

  useEffect(() => {
    if (!menuOpen) return
    requestAnimationFrame(() => {
      const container = navSlideRef.current
      if (!container) return
      const active = container.querySelector('[data-nav-active="true"]')
      if (active) setNavActivePos(navSlideMetrics(active))
    })
  }, [menuOpen, tab, showSettings, isLightMode])

  // 触屏：根据 touch.clientY 找到落在哪个 nav 项上，并把滑块挪过去
  function navSlideFromTouch(touchY) {
    const container = navSlideRef.current
    if (!container) return
    const items = container.querySelectorAll('[data-nav-item="true"]')
    for (const el of items) {
      const r = el.getBoundingClientRect()
      if (touchY >= r.top && touchY <= r.bottom) {
        navSlideFromEl(el)
        return
      }
    }
  }

  // ── 公告 & 留言中心 ────────────────────────────────────
  const [announcement, setAnnouncement] = useState('')
  const [showMsgCenter, setShowMsgCenter] = useState(false)
  const [showAnnBanner, setShowAnnBanner] = useState(false)
  const [msgContent, setMsgContent] = useState('')
  const [msgSending, setMsgSending] = useState(false)
  const [msgSent, setMsgSent] = useState(false)
  const annToday = new Date().toISOString().slice(0, 10)
  // 有公告 且 今天未关闭过 → 显示红点
  const hasUnreadAnn = !!announcement && localStorage.getItem('ann_dismissed_date') !== annToday

  useEffect(() => {
    // 捕获 URL 中的推荐码 ?ref=XXX，存入 localStorage
    const urlRef = new URLSearchParams(window.location.search).get('ref')
    if (urlRef) localStorage.setItem('pending_ref_code', urlRef.toUpperCase())
  }, [])

  useEffect(() => {
    fetch(`${API}/announcement`)
      .then(r => r.json())
      .then(d => {
        if (d.announcement) {
          setAnnouncement(d.announcement)
          if (localStorage.getItem('ann_dismissed_date') !== new Date().toISOString().slice(0, 10)) {
            setShowAnnBanner(true)
          }
        }
      })
      .catch(() => {})
  }, [])

  function dismissAnnBanner() {
    localStorage.setItem('ann_dismissed_date', annToday)
    setShowAnnBanner(false)
  }

  async function sendMessage() {
    const content = msgContent.trim()
    if (!content) return
    setMsgSending(true)
    try {
      const res = await fetch(`${API}/messages`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, username: user || '匿名' }),
      })
      const json = await res.json()
      if (json.ok) {
        setMsgContent('')
        setMsgSent(true)
        setTimeout(() => setMsgSent(false), 3000)
      } else {
        alert(json.error || '发送失败，请稍后再试')
      }
    } catch {
      alert('网络错误，请稍后再试')
    } finally {
      setMsgSending(false)
    }
  }
  const { progress, markMastered, markReview, incrementAttempts, reset, synced } = useProgress(user?.id)

  // 激励系统：XP + 每日目标 + 连续打卡
  const { playVictory: playGoalSound, playFireworks: playGoalFw, playCrystal } = useSound(settings)
  const [goalToast, setGoalToast] = useState(null)
  const handleGoalReached = useCallback(() => {
    playGoalSound(); playGoalFw()
    setGoalToast(true)
    setTimeout(() => setGoalToast(false), 3500)
  }, [playGoalSound, playGoalFw])
  const xp = useXP(token, handleGoalReached)

  // 钻石系统
  const crystal = useCrystal(token)
  const unlocks = useUnlocks(token, isMember || isFounder)
  const [showCrystalPanel, setShowCrystalPanel] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [showWhack, setShowWhack] = useState(false)
  const [showFrog, setShowFrog] = useState(false)
  const [showGames, setShowGames] = useState(false)
  const [showCoach, setShowCoach] = useState(false)
  const [showAbout, setShowAbout] = useState(false)
  const [showMobileLearn, setShowMobileLearn] = useState(false)
  const [mobileShellMode, setMobileShellMode] = useState(() => shouldHideMainChrome())

  useEffect(() => {
    if (shouldAutoLaunchMobileShell()) {
      setShowMobileLearn(true)
      setMobileShellMode(true)
      setMobileShellEnabled(true)
    }
  }, [])

  useEffect(() => {
    const root = document.documentElement
    if (showMobileLearn && mobileShellMode) {
      root.classList.add('mobile-shell-active')
      setMenuOpen(false)
    } else {
      root.classList.remove('mobile-shell-active')
    }
    return () => root.classList.remove('mobile-shell-active')
  }, [showMobileLearn, mobileShellMode])
  // 浏览器返回拦截：内联模态各自接管一层
  useHistoryLayer(showMsgCenter, () => setShowMsgCenter(false))
  useHistoryLayer(showStudentJoin, () => setShowStudentJoin(false))
  const [crystalPulse, setCrystalPulse] = useState(0)

  // 商店背包 / 装备头像
  const [shopInventory, setShopInventory] = useState({
    items: [], pets: [], equipped: { avatar: null, panda_skin: null, theme: null, flame_color: null },
  })
  const [showAvatarPicker, setShowAvatarPicker] = useState(false)
  const [shopInitialTab, setShopInitialTab] = useState(null)

  useEffect(() => {
    if (!token) {
      setShopInventory({ items: [], pets: [], equipped: { avatar: null, panda_skin: null, theme: null, flame_color: null } })
      return
    }
    apiGet('/shop/inventory', token)
      .then(d => {
        if (!d.error) {
          setShopInventory({
            items: d.items || [],
            pets: d.pets || [],
            equipped: d.equipped || { avatar: null, panda_skin: null, theme: null, flame_color: null },
          })
        }
      })
      .catch(() => {})
  }, [token])
  // 监听 crystal.recent 触发徽章脉冲（每次获得抖一下）
  useEffect(() => {
    if (!crystal.recent) return
    setCrystalPulse(p => p + 1)
  }, [crystal.recent])

  /** 所有 Tab 切换的统一入口：同步 React 状态与 history（popstate 回放时不要 push） */
  const tabRef = useRef(tab)
  useEffect(() => {
    tabRef.current = tab
  }, [tab])

  const openTab = useCallback((id, options = {}) => {
    const { skipIfSame = false, pushHistory = true } = options
    if (skipIfSame && tabRef.current === id) return
    setTab(id)
    if (pushHistory && !isPopStateRef.current) {
      window.history.pushState({ kind: 'tab', tab: id }, '')
      setHistoryDepth(d => d + 1)
    }
  }, [])

  const navigateTo = useCallback((id) => {
    openTab(id)
  }, [openTab])

  const navigateFromMenu = useCallback((id) => {
    setMenuOpen(false)
    openTab(id, { skipIfSame: true })
  }, [openTab])

  // Compute prev/next units from ALL_UNITS based on currentLesson

  const allDone = sentences.length > 0 && sentences.every(s => (progress[`sentence_${s.id}`]?.attempts || 0) > 0)
  const isTextbookLesson = currentLesson && ALL_UNITS.some(u => u.label === currentLesson)
  const currentUnitIdx = isTextbookLesson ? ALL_UNITS.findIndex(u => u.label === currentLesson) : -1
  const prevUnit = currentUnitIdx > 0 ? ALL_UNITS[currentUnitIdx - 1] : null
  const nextUnit = currentUnitIdx >= 0 ? (currentUnitIdx + 1 < ALL_UNITS.length ? ALL_UNITS[currentUnitIdx + 1] : 'textbook') : null

  // Generic "next lesson" loader — set by any caller that knows its own sibling list
  // (Duolingo, NCE, Core, Grammar, etc.). Wrapped in ref-like object to avoid React
  // treating the function as a setter update.
  const [nextLessonLoader, setNextLessonLoader] = useState(null)

  const hasNextAvailable = !!nextLessonLoader || (isTextbookLesson && nextUnit !== null)
  const showContinue = allDone && hasNextAvailable

  // Apply lesson state WITHOUT pushing to history (shared by handleImport + popstate restore)
  const applyLesson = useCallback((data, label, nextLoader, packMeta = null) => {
    setSentences(data)
    setExerciseIndex(0)
    setLessonProgress({ index: 0, total: data.length })
    setCurrentLesson(label)
    setLessonPackMeta(packMeta ?? null)
    setNextLessonLoader(nextLoader ? { run: nextLoader } : null)
    openTab('exercise', { pushHistory: false })
  }, [openTab])

  const handleGrammarSyncPractice = useCallback((lessonData, label, distractorPool) => {
    const pool = distractorPool?.length ? distractorPool : lessonData
    const questions = generateQuiz(lessonData, pool)
    if (!questions.length) {
      window.alert('当前课文句子较少，无法生成同步练习题。')
      return
    }
    setGrammarSyncQuiz({ questions, title: `${label} · 同步练习` })
    openTab('grammarSync')
  }, [openTab])

  const handleCoreExerciseQuiz = useCallback((payload) => {
    if (!payload?.questions?.length) return
    setCoreSyncQuiz({ ...payload, sessionKey: Date.now() })
    openTab('coreSync')
  }, [openTab])

  useEffect(() => {
    if (tab !== 'grammarSync') setGrammarSyncQuiz(null)
  }, [tab])

  useEffect(() => {
    if (tab !== 'coreSync') setCoreSyncQuiz(null)
  }, [tab])

  const handleImport = useCallback((data, label = null, nextLoader = null, packMeta = null) => {
    let returnTab = tabRef.current
    if (returnTab === 'exercise' && lessonPackMetaRef.current?.returnTab != null) {
      returnTab = lessonPackMetaRef.current.returnTab
    }
    const mergedMeta = { ...(packMeta || {}), returnTab }
    if (label) lessonRegistryRef.current.set(label, { data, nextLoader, packMeta: mergedMeta })
    applyLesson(data, label, nextLoader, mergedMeta)
    if (label) saveLessonHistory(label, data)
    if (!isPopStateRef.current) {
      window.history.pushState({ kind: 'lesson', label }, '')
      setHistoryDepth(d => d + 1)
    }
  }, [applyLesson])

  /** 练习页左上角返回：回到进入练习前的 Tab（上一级），不使用浏览器 history.back */
  const handleExerciseBack = useCallback(() => {
    const meta = lessonPackMetaRef.current
    let target = meta?.returnTab
    if (target == null || target === 'exercise') {
      if (meta?.source === 'gutenberg') target = 'gutenberg'
      else if (meta?.source === 'grammar') target = 'grammar'
      else if (currentLesson && ALL_UNITS.some(u => u.label === currentLesson)) target = 'textbook'
      else target = 'home'
    }
    setLessonPackMeta(null)
    isPopStateRef.current = true
    try {
      openTab(target, { pushHistory: false })
      window.history.replaceState({ kind: 'tab', tab: target }, '')
    } finally {
      isPopStateRef.current = false
    }
  }, [currentLesson, openTab])

  const handleSettings = useCallback((next) => {
    setSettings(next)
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(next))
  }, [])

  const patchSettings = useCallback((patch) => {
    setSettings((prev) => {
      const next = { ...prev, ...patch }
      localStorage.setItem(SETTINGS_KEY, JSON.stringify(next))
      return next
    })
  }, [])

  const handleSelectSentence = useCallback((i) => {
    setExerciseIndex(i)
    openTab('exercise')
  }, [openTab])

  // Listen to browser back/forward & trackpad swipe (popstate)
  useEffect(() => {
    if (window.history.state === null) {
      window.history.replaceState({ kind: 'tab', tab: 'home' }, '')
    }
    function onPopState(e) {
      // 协作：若有 useHistoryLayer 的模态在场上，这次 pop 是关层不是真正的导航
      // 不要重新 applyLesson / setTab，否则会重置 exerciseIndex / 重拉数据 / 抢音频缓存
      if ((window.__layerCount || 0) > 0) {
        window.__layerCount = Math.max(0, window.__layerCount - 1)
        return
      }
      const state = e.state
      isPopStateRef.current = true
      try {
        if (!state) {
          setTab('home')
        } else if (state.kind === 'lesson' && state.label) {
          const entry = lessonRegistryRef.current.get(state.label)
          if (entry) {
            applyLesson(entry.data, state.label, entry.nextLoader, entry.packMeta ?? null)
          } else {
            setTab('home')
          }
        } else if (state.kind === STUDY_KIND) {
          setTab(state.tab)
          if (state.tab === 'textbook') textbookHistoryRef.current.applyStudy?.(state)
          else if (state.tab === 'courses') coursesHistoryRef.current.applyStudy?.(state)
          else if (state.tab === 'syncpractice') syncPracticeNavRef.current.applyStudy?.(state)
        } else if (state.kind === 'back-intercept') {
          /* 旧版 backFn 占位条目，忽略 UI */
        } else if (state.kind === 'tab') {
          setTab(state.tab)
          if (state.tab === 'textbook') {
            textbookHistoryRef.current.applyStudy?.({ kind: STUDY_KIND, tab: 'textbook' })
          }
          if (state.tab === 'courses') {
            coursesHistoryRef.current.applyStudy?.({ kind: STUDY_KIND, tab: 'courses' })
          }
          if (state.tab === 'syncpractice') {
            syncPracticeNavRef.current.applyStudy?.({ kind: STUDY_KIND, tab: 'syncpractice' })
          }
        }
        setHistoryDepth(d => Math.max(0, d - 1))
      } finally {
        isPopStateRef.current = false
      }
    }
    window.addEventListener('popstate', onPopState)
    return () => window.removeEventListener('popstate', onPopState)
  }, [applyLesson])

  const studyStartRef = useRef(null)

  function handleLogin(username, tok, is_member, is_founder = false) {
    setUser(username)
    setToken(tok)
    setIsMember(!!is_member)
    setIsFounder(!!is_founder)
    localStorage.setItem('auth_token', tok)
    localStorage.setItem('auth_username', username)
    localStorage.setItem('auth_is_member', is_member ? '1' : '0')
    localStorage.setItem('auth_is_founder', is_founder ? '1' : '0')
  }

  function handleLogout() {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_username')
    localStorage.removeItem('auth_is_member')
    localStorage.removeItem('auth_is_founder')
    setUser(null)
    setToken(null)
    setIsMember(false)
    setIsFounder(false)
  }

  useEffect(() => {
    const tok = localStorage.getItem('auth_token')
    if (!tok) return
    let cancelled = false
    setAuthLoading(true)
    apiGet('/session', tok).then(res => {
      if (cancelled) return
      if (res.error) {
        handleLogout()
        return
      }
      setUser(res.username)
      setToken(tok)
      setIsMember(!!res.is_member)
      setIsFounder(!!res.is_founder)
      localStorage.setItem('auth_username', res.username)
      localStorage.setItem('auth_is_member', res.is_member ? '1' : '0')
      localStorage.setItem('auth_is_founder', res.is_founder ? '1' : '0')
    }).finally(() => {
      if (!cancelled) setAuthLoading(false)
    })
    return () => { cancelled = true }
  }, [])

  function handleLeaveClass() {
    localStorage.removeItem('student_id')
    localStorage.removeItem('student_name')
    localStorage.removeItem('student_class_id')
    localStorage.removeItem('student_class_name')
    setStudentInfo(null)
  }

  async function handleUploadSync() {
    if (!token) return
    setSyncStatus('上传中…')
    const data = {}
    for (let i = 0; i < localStorage.length; i++) {
      const k = localStorage.key(i)
      if (k && k !== 'auth_token' && k !== 'auth_username') {
        data[k] = localStorage.getItem(k)
      }
    }
    const res = await apiPost('/sync', { data }, token)
    setSyncStatus(res.ok ? '已同步 ✓' : '同步失败')
    setTimeout(() => setSyncStatus(''), 2500)
  }

  async function handleDownloadSync() {
    if (!token) return
    setSyncStatus('下载中…')
    const res = await apiGet('/sync', token)
    if (res.data) {
      Object.entries(res.data).forEach(([k, v]) => localStorage.setItem(k, v))
      setSyncStatus('已恢复 ✓')
      setTimeout(() => { setSyncStatus(''); window.location.reload() }, 1200)
    } else {
      setSyncStatus('暂无云端数据')
      setTimeout(() => setSyncStatus(''), 2000)
    }
  }

  useEffect(() => {
    if (tab === 'exercise') {
      studyStartRef.current = Date.now()
    } else {
      if (studyStartRef.current) {
        const secs = Math.floor((Date.now() - studyStartRef.current) / 1000)
        if (secs > 0) saveStudyTime(secs, user?.id)
        studyStartRef.current = null
      }
    }
    return () => {
      if (studyStartRef.current) {
        const secs = Math.floor((Date.now() - studyStartRef.current) / 1000)
        if (secs > 0) saveStudyTime(secs, user?.id)
        studyStartRef.current = null
      }
    }
  }, [tab, user?.id])

  const goNextLesson = useCallback(() => {
    if (!showContinue) return
    if (nextLessonLoader?.run) {
      nextLessonLoader.run()
      return
    }
    if (nextUnit === 'textbook') {
      navigateTo('textbook')
    } else if (nextUnit) {
      handleImport(nextUnit.data.slice(nextUnit.slice[0], nextUnit.slice[1]), nextUnit.label)
    }
  }, [showContinue, nextLessonLoader, nextUnit, handleImport])

  // Enter key triggers next unit when lit up (capture phase)
  useEffect(() => {
    if (tab !== 'exercise' || !showContinue) return
    function handleContinueKey(e) {
      if (e.target.tagName === 'INPUT') return
      if (e.key !== 'Enter') return
      e.preventDefault()
      e.stopPropagation()
      goNextLesson()
    }
    window.addEventListener('keydown', handleContinueKey, true)
    return () => window.removeEventListener('keydown', handleContinueKey, true)
  }, [tab, showContinue, goNextLesson])

  function handleGlobalClick() {
    if (!isAudioUnlocked()) {
      unlockAudio()
    }
  }

  // 全局兜底：用户与页面的第一次任意交互即解锁音频，
  // 避免某些组件忘记调 unlockAudio() 导致首屏自动朗读被浏览器静默拦截。
  useEffect(() => {
    if (isAudioUnlocked()) return
    const onFirst = () => { try { unlockAudio() } catch { /* ignore */ } cleanup() }
    const opts = { capture: true, passive: true }
    const evs = ['pointerdown', 'touchstart', 'keydown']
    function cleanup() { evs.forEach((e) => window.removeEventListener(e, onFirst, opts)) }
    evs.forEach((e) => window.addEventListener(e, onFirst, opts))
    return cleanup
  }, [])

  const isHomeLight = isLightMode

  // 移动端断点检测（<640px 启用紧凑菜单）
  const [isMobileMenu, setIsMobileMenu] = useState(
    typeof window !== 'undefined' ? window.innerWidth < 640 : false
  )
  useEffect(() => {
    const onResize = () => setIsMobileMenu(window.innerWidth < 640)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])

  const mainNavItems = [
    { id: 'home', label: '首页', Icon: IconHome, onClick: () => navigateFromMenu('home') },
    { id: 'shop', label: '宝石小店', Icon: IconStar, onClick: () => navigateFromMenu('shop') },
    { id: 'courses', label: '课程广场', Icon: IconBookOpen, onClick: () => navigateFromMenu('courses') },
    { id: 'textbook', label: '教材', Icon: IconBook, onClick: () => navigateFromMenu('textbook') },
    { id: 'grammar', label: '语法', Icon: IconGraduationCap, onClick: () => navigateFromMenu('grammar') },
    { id: 'gutenberg', label: '输入阅读', Icon: IconList, onClick: () => navigateFromMenu('gutenberg') },
    { id: 'vocab', label: '单词', Icon: IconBookmark, onClick: () => navigateFromMenu('vocab') },
    { id: 'alphabet', label: '26字母', Icon: IconBookmark, sub: true, onClick: () => navigateFromMenu('alphabet') },
    { id: 'phonemes', label: '音标学习', Icon: IconBookmark, sub: true, onClick: () => navigateFromMenu('phonemes') },
    { id: 'typing', label: '指法练习', Icon: IconKeyboard, onClick: () => navigateFromMenu('typing') },
    { id: 'games', label: '游戏中心', Icon: IconGamepad, onClick: () => { setMenuOpen(false); setShowGames(true) } },
    { id: 'settings', label: '设置', Icon: IconSettings, onClick: () => { setMenuOpen(false); setShowSettings(true) } },
    { id: 'msgcenter', label: '公告&留言', Icon: IconMessageSquare, bell: true, onClick: () => { setMenuOpen(false); setShowMsgCenter(true) } },
    isFounder
      ? { id: 'founder', label: '创始成员', Icon: IconUsers, gold: true, onClick: () => { setMenuOpen(false); navigateTo('founder') } }
      : { id: 'member', label: '开通会员', Icon: IconCrown, yellow: true, onClick: () => navigateFromMenu('member') },
  ]

  function navItemClass(item) {
    if (isHomeLight) {
      const active = tab === item.id || (item.id === 'settings' && showSettings)
      if (item.gold) return active ? 'lg-nav-item lg-nav-item--mint font-semibold' : 'lg-nav-item text-amber-700'
      if (item.yellow) return active ? 'lg-nav-item lg-nav-item--mint font-semibold' : 'lg-nav-item text-amber-600'
      if (item.bell) return 'lg-nav-item text-sky-600'
      return active ? 'lg-nav-item lg-nav-item--active' : 'lg-nav-item'
    }
    return `flex items-center gap-2 py-1.5 rounded-lg transition-colors shrink-0 px-2 text-sm relative
      ${item.gold ? (tab === 'founder' ? 'bg-yellow-500 text-black' : 'text-yellow-400 hover:bg-yellow-900/40 hover:text-yellow-300')
        : item.yellow ? (tab === 'member' ? 'bg-amber-600 text-white' : 'text-amber-400 hover:bg-amber-900/40 hover:text-amber-300')
        : item.bell ? 'text-sky-400 hover:bg-sky-900/40 hover:text-sky-300'
        : (tab === item.id || (item.id === 'settings' && showSettings)) ? 'bg-slate-700 text-white' : 'text-slate-300 hover:bg-slate-800/80 hover:text-white'}`
  }

  function accountNavClass() {
    if (isHomeLight) return 'lg-nav-item nav-slide-item shrink-0'
    return 'flex items-center gap-2 py-1.5 rounded-lg transition-colors shrink-0 px-2 text-sm relative nav-slide-item text-slate-300'
  }

  const navIconSize = isHomeLight ? 17 : 15

  return (
    <div className={`min-h-screen flex flex-col ${isHomeLight ? 'theme-light-glass' : 'bg-black text-white theme-dark'}`} onClick={handleGlobalClick}>
      <MicPermissionSheet />
      <div className="flex flex-1 relative">
        {/* 亮色模式：月亮切换 + 汉堡，全屏可见，与暗色模式位置对齐 */}
        {!showMobileLearn && !menuOpen && isHomeLight && (
          <>
            <button
              type="button"
              onClick={toggleTheme}
              title="切换夜间模式"
              aria-label="切换夜间模式"
              className="lg-topbar-btn pointer-events-auto fixed z-[102] flex h-11 w-11 items-center justify-center rounded-xl text-[#555] top-[max(0.75rem,env(safe-area-inset-top,0px))]"
              style={{ right: 'calc(max(0.75rem, env(safe-area-inset-right, 0px)) + 3.25rem)' }}
            >
              <IconMoon size={18} />
            </button>
            <button
              type="button"
              aria-label="打开菜单"
              onClick={() => setMenuOpen(true)}
              className="lg-topbar-btn pointer-events-auto fixed z-[102] flex h-11 w-11 items-center justify-center rounded-xl text-[#555] right-[max(0.75rem,env(safe-area-inset-right,0px))] top-[max(0.75rem,env(safe-area-inset-top,0px))]"
            >
              <IconMenu size={22} />
              {hasUnreadAnn && <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />}
            </button>
          </>
        )}
        {!showMobileLearn && !menuOpen && !isHomeLight && (
          <>
            <button
              type="button"
              aria-label="打开菜单"
              onClick={() => setMenuOpen(true)}
              className="pointer-events-auto fixed z-[101] flex h-11 w-11 items-center justify-center rounded-xl border border-slate-600/50 bg-slate-800/95 text-white shadow-lg backdrop-blur-sm transition-colors hover:bg-slate-700 right-[max(0.75rem,env(safe-area-inset-right,0px))] top-[max(0.75rem,env(safe-area-inset-top,0px))]"
            >
              <IconMenu size={22} />
              {hasUnreadAnn && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-1 ring-slate-800" />
              )}
            </button>
            {/* 日夜切换按钮 — 暗色模式时显示在汉堡左侧 */}
            <button
              type="button"
              onClick={toggleTheme}
              title="切换日间模式"
              aria-label="切换日间模式"
              className="pointer-events-auto fixed z-[101] flex h-11 w-11 items-center justify-center rounded-xl border border-slate-600/50 bg-slate-800/95 text-amber-300 shadow-lg backdrop-blur-sm transition-colors hover:bg-slate-700 top-[max(0.75rem,env(safe-area-inset-top,0px))]"
              style={{ right: 'calc(max(0.75rem, env(safe-area-inset-right, 0px)) + 3.25rem)' }}
            >
              <IconSun size={18} />
            </button>
          </>
        )}

        {/* 左上角状态徽章：等宽排列（避免多位数字撑宽中间钻石格） */}
        <div
          data-app-chrome
          className="pointer-events-auto fixed z-[101] flex items-center gap-1.5 left-[max(0.75rem,env(safe-area-inset-left,0px))] top-[max(0.75rem,env(safe-area-inset-top,0px))]"
          style={{ display: showMobileLearn ? 'none' : undefined }}
        >
          <button
            type="button"
            onClick={() => setShowLeaderboard(true)}
            title={`连续打卡 ${xp.streak} 天 · 今日 ${xp.todayXp}/${xp.goal} XP · 点击查看排行榜`}
            className={`flex h-11 w-14 shrink-0 items-center justify-center gap-0.5 rounded-xl border px-1.5 shadow-lg backdrop-blur-sm transition-colors
              ${isHomeLight
                ? (xp.reachedGoalToday ? 'border-amber-300/60 bg-amber-50/90 text-amber-700' : 'border-white/70 bg-white/55 text-[#1a1a1a] hover:bg-white/75')
                : (xp.reachedGoalToday ? 'border-amber-500/50 bg-amber-500/15 text-amber-300' : 'border-slate-600/50 bg-slate-800/95 text-white hover:bg-slate-700')}`}
          >
            <span className="text-lg leading-none">🔥</span>
            <span className="text-sm font-bold tabular-nums">{xp.streak}</span>
          </button>

          <button
            type="button"
            onClick={() => setShowCrystalPanel(true)}
            title={`钻石塔 Lv.${crystal.towerLevel} · 共 ${crystal.total} 颗钻石`}
            className={`flex h-11 w-14 shrink-0 items-center justify-center gap-0.5 rounded-xl border px-1.5 shadow-lg backdrop-blur-sm transition-colors
              ${isHomeLight
                ? 'border-[#b794f6]/40 bg-[rgba(235,222,240,0.75)] text-[#6b21a8] hover:bg-[rgba(235,222,240,0.95)]'
                : 'border-purple-500/50 bg-purple-900/60 text-purple-200 hover:bg-purple-800/80'}`}
          >
            <span key={crystalPulse} className="inline-flex shrink-0 items-center justify-center crystal-pulse">
              <GemSVG color="blue" size={18} />
            </span>
            <span className="text-sm font-bold tabular-nums">{crystal.total}</span>
          </button>
        </div>

        {showGames && (
          <GameLauncher
            onClose={() => setShowGames(false)}
            onPickGame={id => {
              setShowGames(false)
              if (id === 'whack') setShowWhack(true)
              else if (id === 'frog') setShowFrog(true)
            }}
          />
        )}
        {showLeaderboard && (
          <Leaderboard
            token={token}
            currentUsername={user}
            onClose={() => setShowLeaderboard(false)}
          />
        )}
        {showWhack && <WhackAMole onClose={() => setShowWhack(false)} />}
        {showFrog && <FrogJump onClose={() => setShowFrog(false)} onCrystal={crystal.earn} />}
        {showCoach && <AICoach token={token} onClose={() => setShowCoach(false)} />}
        {showAbout && <AboutSite onClose={() => setShowAbout(false)} />}
        {showMobileLearn && (
          <div className="fixed inset-0 z-[200] overflow-hidden">
            <MobileLearnApp
              shellMode={mobileShellMode}
              onClose={() => setShowMobileLearn(false)}
              onExitShell={() => {
                setMobileShellEnabled(false)
                setMobileShellMode(false)
                setShowMobileLearn(false)
              }}
              onAddXp={xp.addXP}
              onCrystalEarn={crystal.earn}
              onOpenShop={() => {
                setShowMobileLearn(false)
                openTab('shop')
              }}
              onOpenLeaderboard={() => setShowLeaderboard(true)}
              unlocks={unlocks}
              crystalBalance={crystal.blue}
              mainXp={{
                streak: xp.streak,
                totalXp: xp.totalXp,
                todayXp: xp.todayXp,
                goal: xp.goal,
              }}
              mainCrystal={{ total: crystal.total }}
              crystalPulse={crystalPulse}
            />
          </div>
        )}

        {/* 今日目标达成 toast */}
        {goalToast && (
          <div className="fixed z-[120] left-1/2 -translate-x-1/2 top-[max(0.75rem,env(safe-area-inset-top,0px))] pointer-events-none">
            <div className="flex items-center gap-2 rounded-full border border-amber-500/50 bg-amber-500/20 px-4 py-2 text-amber-200 text-sm font-semibold shadow-lg backdrop-blur animate-[fadeIn_.3s_ease]">
              🎉 今日目标达成！连续 {xp.streak} 天
            </div>
          </div>
        )}

        {/* 钻石飘字 + 面板（全局） */}
        <CrystalFloat recent={crystal.recent} onPlaySound={playCrystal} />
        {showCrystalPanel && (
          <CrystalPanel crystal={crystal} onClose={() => setShowCrystalPanel(false)} />
        )}
        {showAvatarPicker && (
          <AvatarPicker
            token={token}
            inventory={shopInventory}
            onClose={() => setShowAvatarPicker(false)}
            onEquippedChange={(equipped) => {
              setShopInventory(prev => ({ ...prev, equipped: equipped || { avatar: null, panda_skin: null, theme: null, flame_color: null } }))
            }}
            onGoToShop={() => {
              setShowAvatarPicker(false)
              setShopInitialTab('pets')
              openTab('shop')
            }}
          />
        )}

        {/* 右边缘悬停触发菜单 — 两种模式都生效 */}
        {!menuOpen && (
          <div
            className="fixed top-0 right-0 z-[99] h-[100dvh] w-3 max-w-[14px] pointer-events-auto"
            onMouseEnter={() => setMenuOpen(true)}
            aria-hidden
          />
        )}

        {menuOpen ? (
          <>
            <div
              className={`fixed inset-0 z-[90] ${isHomeLight ? 'lg-overlay' : 'bg-black/45'}`}
              aria-hidden
              onClick={() => setMenuOpen(false)}
            />
            <div
              className={`pointer-events-auto fixed top-0 right-0 z-[100] h-[100dvh] max-h-[100dvh] isolate w-32
                ${isHomeLight ? 'shadow-[-8px_0_32px_rgba(0,0,0,0.06)]' : 'shadow-[-6px_0_28px_rgba(0,0,0,0.4)]'}`}
            >
              {/* ── 主侧边栏 ── */}
              <aside
                aria-label="导航菜单"
                className={`flex h-full min-h-0 w-full flex-col overflow-hidden ${isHomeLight ? 'lg-glass-nav' : 'border-l border-slate-600/45 bg-slate-900'}${isMobileMenu ? ' nav-menu-mobile' : ''}`}
              >
          {/* ── 品牌头部：头像（可切换）+ 收起 ── */}
          <div className={`nav-menu-header shrink-0 flex items-center gap-1 px-1.5 ${isMobileMenu ? 'pt-[max(0.25rem,env(safe-area-inset-top,0px))] pb-0' : 'pt-[max(0.75rem,env(safe-area-inset-top,0px))] pb-2'}`}>
            <button
              type="button"
              onClick={() => {
                setMenuOpen(false)
                if (token) setShowAvatarPicker(true)
                else setShowLogin(true)
              }}
              className="group flex-1 flex items-center justify-center transition-transform active:scale-95"
              aria-label="切换头像"
            >
              <div className={`nav-menu-avatar-slot rounded-[22%] overflow-hidden flex items-center justify-center ${isMobileMenu ? 'w-11 h-11' : 'w-16 h-16'}`}>
                {shopInventory.equipped?.avatar ? (
                  <PetAvatar
                    petId={shopInventory.equipped.avatar}
                    size={isMobileMenu ? 44 : 64}
                    className="transition-transform duration-300 group-hover:scale-110"
                  />
                ) : (
                  <img
                    src="/panda-icon.webp"
                    alt="OK英语"
                    className="w-full h-full object-cover scale-110 transition-transform duration-300 group-hover:scale-125 group-hover:rotate-3"
                  />
                )}
              </div>
            </button>
            <button
              onClick={() => setMenuOpen(false)}
              aria-label="收起菜单"
              className={`nav-menu-close relative flex shrink-0 items-center justify-center rounded-xl transition-colors
                ${isMobileMenu ? 'h-8 w-8' : 'h-11 w-11'}
                ${isHomeLight
                  ? 'border border-white/60 bg-white/40 text-[#1a1a1a] hover:bg-white/65'
                  : 'border border-slate-600/50 bg-slate-800/95 text-white hover:bg-slate-700'}`}
            >
              <IconMenu size={isMobileMenu ? 16 : 22} />
              {hasUnreadAnn && (
                <span className={`absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ${isHomeLight ? 'ring-1 ring-white' : 'ring-1 ring-slate-800'}`} />
              )}
            </button>
          </div>

          <div className={`shrink-0 mx-2 border-t ${isHomeLight ? 'lg-divider' : 'border-slate-700/70'}`} />

          <div className={`nav-menu-scroll flex min-h-0 flex-1 flex-col overflow-x-hidden overscroll-contain ${isMobileMenu ? 'px-1.5 overflow-hidden' : 'px-2 gap-0.5 overflow-y-auto'}`}
            style={{ paddingBottom: isMobileMenu ? 'max(env(safe-area-inset-bottom, 0px), 4px)' : 'calc(env(safe-area-inset-bottom, 0px) + 24px)' }}>

          {/* 导航菜单 — 登录/班级 + 页面入口，滑动薰衣草玻璃高亮 */}
          <div
            ref={navSlideRef}
            className={`nav-menu-nav relative flex flex-col ${isMobileMenu ? 'min-h-0 flex-1 justify-between' : 'gap-0.5'}`}
            style={{ touchAction: 'none' }}
            onMouseLeave={() => setNavSlidePos(null)}
            onTouchStart={(e) => { e.preventDefault(); if (e.touches[0]) navSlideFromTouch(e.touches[0].clientY) }}
            onTouchMove={(e) => { e.preventDefault(); if (e.touches[0]) navSlideFromTouch(e.touches[0].clientY) }}
            onTouchEnd={() => setNavSlidePos(null)}
          >
            {/* 滑动高亮块（明暗都启用） */}
            {(navSlidePos || navActivePos) && (() => {
              const pos = navSlidePos || navActivePos
              return (
              <div
                aria-hidden
                className={`nav-slide-highlight ${isHomeLight ? 'is-light' : 'is-dark'}`}
                style={{
                  position: 'absolute',
                  top: pos.top,
                  height: pos.h,
                  left: pos.left ?? 0,
                  width: pos.w ?? undefined,
                  right: pos.w != null ? undefined : 0,
                  borderRadius: 14,
                  pointerEvents: 'none',
                  zIndex: 0,
                  willChange: 'top, left, width',
                  transition: 'top 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), left 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), width 0.28s cubic-bezier(0.34, 1.56, 0.64, 1), height 0.2s ease, opacity 0.15s ease',
                }}
              />
              )
            })()}

            {/* 登录 / 班级 — 各占一行，与导航项同款 */}
            {user ? (
              <button
                type="button"
                data-nav-item="true"
                onClick={() => { setMenuOpen(false); handleLogout() }}
                title={`${user} · 点击退出`}
                onMouseEnter={(e) => navSlideFromEl(e.currentTarget)}
                style={{ position: 'relative', zIndex: 1 }}
                className={`${accountNavClass()} ${isHomeLight ? '' : 'px-2 text-sm'}`}
              >
                <IconUser size={navIconSize} />
                <span className="truncate">{user}</span>
              </button>
            ) : (
              <button
                type="button"
                data-nav-item="true"
                onClick={() => { setMenuOpen(false); setShowLogin(true) }}
                onMouseEnter={(e) => navSlideFromEl(e.currentTarget)}
                style={{ position: 'relative', zIndex: 1 }}
                className={`${accountNavClass()} ${isHomeLight ? '' : 'px-2 text-sm'}`}
              >
                <IconUser size={navIconSize} />
                <span className="truncate">登录</span>
              </button>
            )}

            {studentInfo ? (
              <button
                type="button"
                data-nav-item="true"
                onClick={() => { setMenuOpen(false); handleLeaveClass() }}
                title={`${studentInfo.studentName} · ${studentInfo.className} · 点击退出`}
                onMouseEnter={(e) => navSlideFromEl(e.currentTarget)}
                style={{ position: 'relative', zIndex: 1 }}
                className={`${accountNavClass()} ${isHomeLight ? '' : 'px-2 text-sm'}`}
              >
                <IconUsers size={navIconSize} />
                <span className="truncate">{studentInfo.className}</span>
              </button>
            ) : (
              <button
                type="button"
                data-nav-item="true"
                onClick={() => { setMenuOpen(false); setShowStudentJoin(true) }}
                onMouseEnter={(e) => navSlideFromEl(e.currentTarget)}
                style={{ position: 'relative', zIndex: 1 }}
                className={`${accountNavClass()} ${isHomeLight ? '' : 'px-2 text-sm'}`}
              >
                <IconUsers size={navIconSize} />
                <span className="truncate">加入班级</span>
              </button>
            )}

            {mainNavItems.map(item => {
              const active = tab === item.id || (item.id === 'settings' && showSettings)
              return (
                <button key={item.id}
                  data-nav-active={active ? 'true' : undefined}
                  data-nav-item="true"
                  onClick={item.onClick}
                  onMouseEnter={(e) => navSlideFromEl(e.currentTarget)}
                  style={{ position: 'relative', zIndex: 1 }}
                  className={`${navItemClass(item)} shrink-0 nav-slide-item ${isHomeLight ? '' : 'px-2 text-sm'}`}
                >
                  {item.Icon ? <item.Icon size={navIconSize} /> : <span className="w-[17px] text-center">{item.iconText}</span>}
                  <span className="truncate">{item.label}</span>
                  {item.bell && hasUnreadAnn && (
                    <span className="ml-auto w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                  )}
                </button>
              )
            })}
          </div>

          {/* 云同步（登录后显示，桌面端） */}
          {user && !isMobileMenu && (
            <div className={`flex shrink-0 flex-col gap-1 pt-2 border-t ${isHomeLight ? 'lg-divider' : 'border-slate-700/70'}`}>
              <button onClick={() => { setMenuOpen(false); handleUploadSync() }} className={isHomeLight ? 'lg-nav-item text-[#707070]' : 'flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-800/80 hover:text-white transition-colors'}>
                <IconRefresh size={isHomeLight ? 15 : 13} /><span>{syncStatus || '上传进度'}</span>
              </button>
              <button onClick={() => { setMenuOpen(false); handleDownloadSync() }} className={isHomeLight ? 'lg-nav-item text-[#707070]' : 'flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-slate-400 hover:bg-slate-800/80 hover:text-white transition-colors'}>
                <IconDownload size={isHomeLight ? 15 : 13} /><span>恢复进度</span>
              </button>
            </div>
          )}
              </div>
              </aside>
            </div>
          </>
        ) : null}

        {/* Main content */}
        <main
          data-app-main
          className={`flex-1 flex flex-col items-center justify-start px-4 transition-all duration-200${(tab === 'exercise' || tab === 'vocab') ? ' ocean-main' : ''} ${tab === 'exercise' && nav ? 'pb-32' : 'pb-24'} }`}
          style={{ paddingTop: 'calc(max(0.75rem, env(safe-area-inset-top, 0px)) + 3.25rem)' }}
        >
          <div style={{ display: tab === 'home' ? 'contents' : 'none' }}>
            <Dashboard
              sentences={sentences}
              progress={progress}
              onStartExercise={() => openTab('exercise')}
              onImport={handleImport}
              onOpenGutenberg={() => navigateFromMenu('gutenberg')}
              onOpenAbout={() => setShowAbout(true)}
              onOpenMobileLearn={() => {
                setShowMobileLearn(true)
                if (isCapacitorNative()) {
                  setMobileShellMode(true)
                  setMobileShellEnabled(true)
                }
              }}
              changyongData={changyongData}
              sampleData={sampleData}
              xp={xp}
              isMember={isMember}
              isFounder={isFounder}
              studentInfo={studentInfo}
            />
          </div>
          <div style={{ display: tab === 'shop' ? 'contents' : 'none' }}>
            <Shop
              token={token}
              crystal={crystal}
              inventory={shopInventory}
              onInventoryChange={setShopInventory}
              onEquippedChange={(equipped) => {
                setShopInventory(prev => ({ ...prev, equipped: equipped || { avatar: null, panda_skin: null, theme: null, flame_color: null } }))
              }}
              initialTab={shopInitialTab}
              onShowLogin={() => setShowLogin(true)}
              onClose={() => { setShopInitialTab(null); openTab('exercise') }}
            />
          </div>
          <div style={{ display: tab === 'courses' ? 'contents' : 'none' }}>
            <Courses
              onImport={handleImport}
              changyongData={changyongData}
              sampleData={sampleData}
              onClose={() => openTab('exercise')}
              historyRef={coursesHistoryRef}
              active={tab === 'courses'}
              progress={progress}
              isMember={UNLOCK_ALL_COURSES || isMember}
              onShowLogin={() => setShowLogin(true)}
              unlocks={unlocks}
              crystalBalance={crystal.blue}
              onGoShop={() => openTab('shop')}
              onSyncPractice={(data, label, unitNum) => {
                if (unitNum) {
                  setSyncInitialUnit(unitNum)
                  navigateTo('syncpractice')
                } else {
                  handleImport(data, label)
                  navigateTo('syncpractice')
                }
              }}
              onExerciseQuiz={handleCoreExerciseQuiz}
            />
          </div>
          <div style={{ display: tab === 'textbook' ? 'contents' : 'none' }}>
            <Textbook
              onImport={handleImport}
              onClose={() => openTab('exercise')}
              historyRef={textbookHistoryRef}
              active={tab === 'textbook'}
              progress={progress}
              onNavigate={navigateTo}
              requireSpeak={settings?.requireSpeak}
              hideSkipNext={settings?.hideSplitSkip !== false}
              isMember={UNLOCK_ALL_COURSES || isMember}
              onShowLogin={() => setShowLogin(true)}
              settings={settings}
              onXp={xp.addXP}
              onCrystal={crystal.earn}
              unlocks={unlocks}
              crystalBalance={crystal.blue}
              onGoShop={() => openTab('shop')}
            />
          </div>
          <div style={{ display: tab === 'grammar' ? 'contents' : 'none' }}>
            <Grammar
              onImport={handleImport}
              onClose={() => openTab('exercise')}
              onGrammarSyncPractice={handleGrammarSyncPractice}
              active={tab === 'grammar'}
              progress={progress}
              isMember={UNLOCK_ALL_COURSES || isMember}
              onShowLogin={() => setShowLogin(true)}
              unlocks={unlocks}
              crystalBalance={crystal.blue}
              onGoShop={() => openTab('shop')}
            />
          </div>
          <div style={{ display: tab === 'gutenberg' ? 'contents' : 'none' }}>
            <GutenbergReading
              onClose={() => openTab('exercise')}
              onStartReading={(data, label) => handleImport(data, label, null, { source: 'gutenberg' })}
              isMember={UNLOCK_ALL_COURSES || isMember}
              onShowLogin={() => setShowLogin(true)}
              unlocks={unlocks}
              crystalBalance={crystal.blue}
              onGoShop={() => openTab('shop')}
            />
          </div>
          {tab === 'grammarSync' && (
            grammarSyncQuiz ? (
              <ExerciseQuiz
                questions={grammarSyncQuiz.questions}
                title={grammarSyncQuiz.title}
                settings={settings}
                onXp={xp.addXP}
                onCrystal={crystal.earn}
                onClose={() => {
                  setGrammarSyncQuiz(null)
                  openTab('grammar')
                }}
              />
            ) : (
              <div className="w-full max-w-lg mx-auto px-4 py-6">
                <PageBackBar onBack={() => openTab('grammar')} label="返回语法专项" />
                <p className="text-gray-500 text-sm mt-4 text-center">没有进行中的同步练习，请从语法专项某一课进入。</p>
              </div>
            )
          )}
          {tab === 'coreSync' && (
            coreSyncQuiz ? (
              <ExerciseQuiz
                key={coreSyncQuiz.sessionKey}
                questions={coreSyncQuiz.questions}
                title={coreSyncQuiz.title}
                settings={settings}
                onXp={xp.addXP}
                onCrystal={crystal.earn}
                onFinish={({ score, total }) => {
                  if (score >= 7) crystal.earn('green', 1, 'core-sync-pass', { title: coreSyncQuiz.title })
                  if (score === total) crystal.earn('purple', 1, 'core-sync-perfect', { title: coreSyncQuiz.title })
                }}
                onRetry={() => handleCoreExerciseQuiz({
                  questions: coreSyncQuiz.questions,
                  title: coreSyncQuiz.title,
                  returnSection: coreSyncQuiz.returnSection,
                  lessonLabel: coreSyncQuiz.lessonLabel,
                })}
                closeLabel="返回核心句群"
                onClose={() => {
                  const section = coreSyncQuiz.returnSection
                  setCoreSyncQuiz(null)
                  coursesHistoryRef.current.applyStudy?.({ cd: 'core', coreSection: section })
                  openTab('courses')
                }}
              />
            ) : (
              <div className="w-full max-w-lg mx-auto px-4 py-6">
                <PageBackBar onBack={() => openTab('courses')} label="返回课程广场" />
                <p className="text-gray-500 text-sm mt-4 text-center">没有进行中的同步练习，请从核心句群某一课进入。</p>
              </div>
            )
          )}
          {tab === 'exercise' && (
            <ExerciseView
              key={currentLesson || 'default'}
              sentences={sentences}
              progress={progress}
              onMarkMastered={markMastered}
              onMarkReview={markReview}
              onIncrementAttempts={incrementAttempts}
              settings={settings}
              onPatchSettings={patchSettings}
              initialIndex={exerciseIndex}
              onProgressChange={(i, total) => setLessonProgress({ index: i, total })}
              onNav={setNav}
              userId={user}
              token={token}
              showChineseGuide={showChineseGuide}
              onToggleChineseGuide={() => setShowChineseGuide(v => !v)}
              hasNextLesson={showContinue}
              onNextLesson={goNextLesson}
              onBack={handleExerciseBack}
              grammarContext={lessonPackMeta}
              onSentenceDone={onSentenceDone}
              onWordDone={onWordDone}
              onXp={xp.addXP}
              onCrystal={crystal.earn}
            />
          )}
          {tab === 'list' && (
            <div className="w-full max-w-4xl">
              <PageBackBar onBack={() => openTab('exercise')} label="返回练习" />
              <SentenceList sentences={sentences} progress={progress} onSelect={handleSelectSentence} />
            </div>
          )}
          {tab === 'import' && (
            <div className="w-full max-w-sm">
              <ImportPanel onImport={handleImport} currentCount={sentences.length} onClose={() => openTab('exercise')} />
            </div>
          )}
          {tab === 'quiz' && (
            <Quiz onImport={handleImport} onClose={() => openTab('exercise')} settings={settings}
              onXp={xp.addXP} onCrystal={crystal.earn}
              isMember={UNLOCK_ALL_COURSES || isMember} onShowLogin={() => setShowLogin(true)} />
          )}
          {tab === 'fillblank' && (
            <FillBlank onClose={() => openTab('exercise')} settings={settings}
              onXp={xp.addXP} onCrystal={crystal.earn}
              isMember={UNLOCK_ALL_COURSES || isMember} onShowLogin={() => setShowLogin(true)} />
          )}
          {tab === 'syncpractice' && (
            <SyncPractice
              onClose={() => openTab('exercise')}
              requireSpeak={settings?.requireSpeak}
              hideSkipNext={settings?.hideSplitSkip !== false}
              navRef={syncPracticeNavRef}
              initialUnit={syncInitialUnit}
              onInitialConsumed={() => setSyncInitialUnit(null)}
              settings={settings}
              onXp={xp.addXP}
              onCrystal={crystal.earn}
            />
          )}
          <div style={{ display: tab === 'vocab' ? 'contents' : 'none' }}>
            <VocabStudy onClose={() => openTab('exercise')}
              isMember={UNLOCK_ALL_COURSES || isMember} onShowLogin={() => setShowLogin(true)} settings={settings}
              onXp={xp.addXP} onCrystal={crystal.earn}
              unlocks={unlocks}
              crystalBalance={crystal.blue}
              onGoShop={() => openTab('shop')}
            />
          </div>
          <div style={{ display: tab === 'alphabet' ? 'contents' : 'none' }}>
            <AlphabetLearn
              onClose={() => openTab('exercise')}
              settings={settings}
              onXp={xp.addXP}
              onCrystal={crystal.earn}
              isMember={UNLOCK_ALL_COURSES || isMember}
              unlocks={unlocks}
              crystalBalance={crystal.blue}
              onGoShop={() => openTab('shop')}
            />
          </div>
          <div style={{ display: tab === 'phonemes' ? 'contents' : 'none' }}>
            <PhonemeLearn
              onClose={() => openTab('exercise')}
              settings={settings}
              onXp={xp.addXP}
              onCrystal={crystal.earn}
              isMember={UNLOCK_ALL_COURSES || isMember}
              unlocks={unlocks}
              crystalBalance={crystal.blue}
              onGoShop={() => openTab('shop')}
            />
          </div>
          {tab === 'phonics' && (
            <PhonicsLesson onClose={() => openTab('exercise')} onXp={xp.addXP} onCrystal={crystal.earn} />
          )}
          {tab === 'typing' && (
            <TypingPractice
              onClose={() => openTab('exercise')}
              onXp={xp.addXP}
              onCrystal={crystal.earn}
              isMember={UNLOCK_ALL_COURSES || isMember}
              unlocks={unlocks}
              crystalBalance={crystal.blue}
              onGoShop={() => openTab('shop')}
            />
          )}
          {tab === 'member' && (
            <MemberPage
              user={user}
              token={token}
              onClose={() => openTab('home')}
              onShowLogin={() => setShowLogin(true)}
              onFounderSuccess={() => {
                setIsFounder(true)
                localStorage.setItem('auth_is_founder', '1')
              }}
              onOpenFounder={() => openTab(isFounder ? 'founder' : 'member')}
            />
          )}
          {tab === 'referral' && (
            <ReferralCenter token={token} username={user} />
          )}
          {tab === 'founder' && (
            isFounder
              ? <FounderCenter token={token} username={user} onClose={() => openTab('home')} />
              : <MemberPage
                  user={user}
                  token={token}
                  initialPlan="founder"
                  onClose={() => openTab('home')}
                  onShowLogin={() => setShowLogin(true)}
                  onFounderSuccess={() => {
                    setIsFounder(true)
                    localStorage.setItem('auth_is_founder', '1')
                    openTab('founder')
                  }}
                  onOpenFounder={() => openTab('founder')}
                />
          )}
        </main>
      </div>

      {/* 仅练习页展示底栏控件；子页面请用各页左上角「返回」 */}
      {tab !== 'syncpractice' && tab === 'exercise' && nav && !nav.readingMode && (
      <footer className="fixed bottom-0 left-0 right-0 bg-slate-900/95 backdrop-blur border-t border-slate-700/60 z-40">
        <div>
            <>
              <div className="px-4 pt-1.5 pb-2 flex items-center gap-3">
                <div className="flex items-center gap-1.5 shrink-0">
                  {/* 上一句 / 下一句 */}
                  <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-xl p-1">
                    <button onClick={nav.prev} disabled={!nav.canPrev}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white/70 hover:bg-slate-700 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed transition-colors">
                      <IconArrowLeft size={14} /><span>上一句</span>
                    </button>
                    <button onClick={nav.next} disabled={!nav.canNext}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white/70 hover:bg-slate-700 hover:text-white disabled:opacity-25 disabled:cursor-not-allowed transition-colors">
                      <span>下一句</span><IconArrowRight size={14} />
                    </button>
                  </div>

                  <div className="w-px h-5 bg-gray-800 mx-0.5" />

                  {/* 复习 / 解释 */}
                  <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-xl p-1">
                    <button
                      onClick={() => { setReviewData(getRecentErrors(2)); setShowReview(true) }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white/70 hover:bg-slate-700 hover:text-white transition-colors">
                      <IconBookmark size={14} /><span>复习</span>
                    </button>
                    <button onClick={nav.toggleCard}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white/70 hover:bg-slate-700 hover:text-white transition-colors">
                      <IconInfo size={14} /><span>解释</span>
                    </button>
                  </div>

                  <div className="w-px h-5 bg-gray-800 mx-0.5" />

                  {/* 拆句: 初级 / 高级 */}
                  <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-xl p-1">
                    {[1, 3].map(level => {
                      const labels = { 1: '初级', 3: '高级' }
                      const isActive = nav.splitLevel === level
                      return (
                        <button key={level} onClick={() => nav.setSplitLevel?.(level)}
                          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors
                            ${isActive ? 'bg-white/10 text-white border border-white/20' : 'text-white/70 hover:bg-slate-700 hover:text-white'}`}>
                          {isActive && <IconSplit size={12} />}
                          <span>拆{labels[level]}</span>
                        </button>
                      )
                    })}
                  </div>

                  <div className="w-px h-5 bg-gray-800 mx-0.5" />

                  {/* 上一单元 / 下一单元 */}
                  <div className="flex items-center gap-1 bg-slate-800 border border-slate-700 rounded-xl p-1">
                    <button
                      onClick={() => prevUnit && handleImport(prevUnit.data.slice(prevUnit.slice[0], prevUnit.slice[1]), prevUnit.label)}
                      disabled={!prevUnit}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors
                        ${prevUnit ? 'text-white/70 hover:bg-slate-700 hover:text-white' : 'text-slate-600 cursor-default'}`}>
                      <span>上一单元</span>
                    </button>
                    <button
                      onClick={() => {
                        if (nextUnit === 'textbook') { navigateTo('textbook') }
                        else if (nextUnit) { handleImport(nextUnit.data.slice(nextUnit.slice[0], nextUnit.slice[1]), nextUnit.label) }
                      }}
                      disabled={!nextUnit}
                      className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-sm font-medium transition-colors
                        ${nextUnit ? 'text-white/70 hover:bg-slate-700 hover:text-white' : 'text-slate-600 cursor-default'}`}>
                      <span>下一单元</span>
                    </button>
                  </div>
                </div>

                <div className="flex-1 rounded-lg border border-slate-700 bg-slate-800/70 px-3 py-1.5 min-w-0 text-right">
                  <div className="text-[11px] text-slate-500 truncate">{currentLesson || '当前课程'}</div>
                  <div className="text-xs text-slate-300 font-mono">{lessonProgress.index + 1}/{lessonProgress.total}</div>
                </div>
              </div>
            </>
        </div>
      </footer>
      )}

      {/* Exercise history modal */}
      {showExerciseHistory && (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/60" onClick={() => setShowExerciseHistory(false)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-sm shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700">
              <span className="text-white text-sm font-semibold">最近学习记录</span>
              <button onClick={() => setShowExerciseHistory(false)} className="text-gray-500 hover:text-white text-lg leading-none">✕</button>
            </div>
            <div className="max-h-80 overflow-y-auto py-1">
              {(() => {
                const history = loadLessonHistory()
                if (history.length === 0) return <div className="text-gray-500 text-sm text-center py-6">暂无记录</div>
                return history.slice(0, 10).map((h, i) => (
                  <button key={i}
                    onClick={() => {
                      const unit = ALL_UNITS.find(u => u.label === h.label)
                      if (unit) {
                        handleImport(unit.data.slice(unit.slice[0], unit.slice[1]), unit.label)
                      }
                      setShowExerciseHistory(false)
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-slate-700 transition-colors flex items-center justify-between gap-3 border-b border-slate-700/50 last:border-b-0"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-200 truncate">{h.label}</div>
                      <div className="text-xs text-gray-500">{h.count} 句 · {new Date(h.ts).toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</div>
                    </div>
                    <IconArrowRight size={14} className="text-gray-600 shrink-0" />
                  </button>
                ))
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Review modal: top error sentences & words */}
      {showReview && reviewData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-black/70" onClick={() => setShowReview(false)}>
          <div className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[80vh] flex flex-col" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700 shrink-0">
              <span className="text-white text-sm font-semibold">近2天错误最多（复习）</span>
              <button onClick={() => setShowReview(false)} className="text-gray-500 hover:text-white text-lg leading-none">✕</button>
            </div>
            <div className="overflow-y-auto flex-1 py-2">
              {reviewData.topSentences.length === 0 && reviewData.topWords.length === 0 ? (
                <div className="text-gray-500 text-sm text-center py-8">近2天暂无错误记录</div>
              ) : (
                <>
                  {reviewData.topSentences.length > 0 && (
                    <div className="px-4 pb-2">
                      <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2 mt-1">错误句子 Top {reviewData.topSentences.length}</div>
                      {reviewData.topSentences.map((item, i) => (
                        <button key={i}
                          onClick={() => {
                            // find the sentence in all data sources
                            const allData = [...grade3UpData, ...grade3DownData, ...grade4UpData, ...grade4DownData, ...grade5UpData, ...sampleData]
                            const s = allData.find(d => d.id === item.sentenceId)
                            if (s) {
                              handleImport([s], `复习 · 错误句子`)
                            }
                            setShowReview(false)
                          }}
                          className="w-full text-left px-3 py-2 rounded-xl hover:bg-slate-700 transition-colors mb-1 flex items-center justify-between gap-3"
                        >
                          <div className="flex-1 min-w-0">
                            <div className="text-sm text-white truncate">{item.sentenceEn}</div>
                          </div>
                          <span className="text-xs text-red-400 bg-red-900/30 px-2 py-0.5 rounded-full shrink-0">错{item.count}次</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {reviewData.topWords.length > 0 && (
                    <div className="px-4 pb-2 border-t border-slate-700 mt-1 pt-3">
                      <div className="text-xs text-gray-500 font-semibold uppercase tracking-wider mb-2">错误单词 Top {reviewData.topWords.length}</div>
                      <div className="flex flex-wrap gap-2">
                        {reviewData.topWords.map((item, i) => (
                          <div key={i} className="flex items-center gap-1.5 bg-gray-800 border border-gray-700 rounded-lg px-3 py-1.5">
                            <span className="text-sm text-white font-medium">{item.word}</span>
                            <span className="text-xs text-red-400">×{item.count}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Settings modal */}
      {showSettings && (
        <Settings settings={settings} onChange={handleSettings} onReset={reset}
          onClose={() => setShowSettings(false)}
          onOpenImport={() => { setShowSettings(false); openTab('import') }}
        />
      )}

      {/* Login modal */}
      {showLogin && <LoginModal onClose={() => setShowLogin(false)} onLogin={handleLogin} />}

      {/* ── 公告弹窗（居中长方形，最高 z-index，所有用户可见）── */}
      {showAnnBanner && announcement && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black/75 backdrop-blur-sm px-4"
          onClick={dismissAnnBanner}>
          <div
            className="relative w-full max-w-lg bg-gradient-to-br from-amber-500 to-orange-600 border-2 border-amber-300/40 rounded-3xl shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}>
            {/* 关闭按钮 */}
            <button
              onClick={dismissAnnBanner}
              aria-label="关闭公告"
              className="absolute top-3 right-3 z-10 w-9 h-9 rounded-full bg-white/95 hover:bg-white text-slate-800 text-lg font-bold shadow flex items-center justify-center transition-transform hover:scale-110">
              ×
            </button>
            {/* 头部 */}
            <div className="flex items-center gap-3 px-6 pt-6 pb-3">
              <div className="w-12 h-12 rounded-2xl bg-white/25 flex items-center justify-center text-2xl shrink-0 shadow-inner">📢</div>
              <div>
                <div className="text-[11px] uppercase tracking-widest text-white/80 font-semibold">站点公告</div>
                <h3 className="text-xl font-extrabold text-white">最新通知</h3>
              </div>
            </div>
            {/* 内容 */}
            <div className="bg-white/95 px-6 py-5 m-4 rounded-2xl">
              <p className="text-slate-800 text-base leading-relaxed whitespace-pre-wrap">{announcement}</p>
            </div>
            {/* 底部按钮 */}
            <div className="px-6 pb-5 flex justify-end">
              <button
                onClick={dismissAnnBanner}
                className="px-6 py-2.5 rounded-full bg-white text-amber-700 font-bold text-sm shadow-lg hover:scale-105 transition-transform">
                知道了
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── 公告 & 留言中心弹窗 ── */}
      {showMsgCenter && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center bg-black/70 px-4"
          onClick={() => setShowMsgCenter(false)}
        >
          <CloseBadge onClose={() => setShowMsgCenter(false)} />
          <div
            className="bg-gray-900 border border-gray-700 rounded-2xl w-full max-w-sm shadow-2xl overflow-hidden"
            onClick={e => e.stopPropagation()}
          >
            {/* 标题栏 */}
            <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-gray-800">
              <div className="flex items-center gap-2">
                <IconMessageSquare size={17} className="text-sky-400" />
                <h3 className="text-base font-bold text-white">公告 & 留言</h3>
              </div>
            </div>

            <div className="p-5 flex flex-col gap-5">
              {/* 公告区 */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-base">📢</span>
                  <span className="text-xs font-semibold text-amber-400 uppercase tracking-wider">最新公告</span>
                </div>
                <div className="bg-gray-800/60 rounded-xl px-4 py-3 min-h-[3rem] flex items-center">
                  {announcement
                    ? <p className="text-gray-200 text-sm leading-relaxed whitespace-pre-wrap">{announcement}</p>
                    : <p className="text-gray-600 text-sm">暂无公告</p>
                  }
                </div>
              </div>

              {/* 留言区 */}
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <span className="text-base">💬</span>
                  <span className="text-xs font-semibold text-sky-400 uppercase tracking-wider">给我们留言</span>
                </div>
                {user ? (
                  <>
                    <div className="flex items-center gap-1.5 mb-2">
                      <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center text-[10px] font-bold text-white shrink-0">
                        {user[0].toUpperCase()}
                      </div>
                      <span className="text-gray-400 text-xs">{user}</span>
                    </div>
                    <textarea
                      value={msgContent}
                      onChange={e => setMsgContent(e.target.value)}
                      placeholder="写下你的问题或建议…"
                      rows={3}
                      maxLength={500}
                      className="w-full bg-gray-800 border border-gray-700 focus:border-blue-500 rounded-xl px-3 py-2.5 text-sm text-white placeholder-gray-600 outline-none resize-none transition-colors"
                    />
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-gray-600">{msgContent.length}/500</span>
                      {msgSent
                        ? <span className="text-xs text-green-400 font-medium">✓ 已发送，感谢反馈！</span>
                        : <button
                            onClick={sendMessage}
                            disabled={msgSending || !msgContent.trim()}
                            className="px-4 py-1.5 bg-blue-600 hover:bg-blue-500 disabled:opacity-40 text-white text-sm font-semibold rounded-lg transition-colors"
                          >
                            {msgSending ? '发送中…' : '发送'}
                          </button>
                      }
                    </div>
                  </>
                ) : (
                  <div className="bg-gray-800/60 rounded-xl px-4 py-3 text-center">
                    <p className="text-gray-500 text-sm">请先
                      <button
                        onClick={() => { setShowMsgCenter(false); setShowLogin(true) }}
                        className="text-blue-400 hover:text-blue-300 mx-1 underline underline-offset-2"
                      >登录</button>
                      后留言
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
      {showStudentJoin && (
        <StudentJoin
          onJoined={info => { setStudentInfo(info); setShowStudentJoin(false) }}
          onSkip={() => setShowStudentJoin(false)}
        />
      )}
    </div>
  )
}

export default function App() {
  // 教师端模式：URL 含 ?teacher 时直接渲染教师工作台（不挂载主应用的 hooks）
  if (window.location.search.includes('teacher') || window.location.pathname === '/teacher') {
    return <TeacherDashboard />
  }
  return <MainApp />
}
