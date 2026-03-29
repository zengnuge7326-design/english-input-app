import { useState, useEffect } from 'react'
import duolingoData from '../data/duolingo.json'

// 多邻国课程：Unit1 7课 + Unit2 28课，共35课
// 每课对应 duolingo.json 的 id 范围（按顺序连续）
const DUOLINGO_LESSONS = [
  // Unit 1
  { unit: 1, label: 'L1', ids: [1,2,3,4] },
  { unit: 1, label: 'L2', ids: [5,6,7,8] },
  { unit: 1, label: 'L3', ids: [9,10,11,12] },
  { unit: 1, label: 'L4', ids: [13,14,15,16] },
  { unit: 1, label: 'L5', ids: [17,18,19,20] },
  { unit: 1, label: 'L6', ids: [21,22,23,24,25,26] },
  { unit: 1, label: 'L7', ids: [27,28,29,30,31] },
  // Unit 2
  { unit: 2, label: 'L1', ids: [32,33,34,35] },
  { unit: 2, label: 'L2', ids: [36,37,38,39,40] },
  { unit: 2, label: 'L3', ids: [41,42,43,44] },
  { unit: 2, label: 'L4', ids: [45,46,47,48,49,50] },
  { unit: 2, label: 'L5', ids: [51,52,53,54,55] },
  { unit: 2, label: 'L6', ids: [56,57,58,59,60] },
  { unit: 2, label: 'L7', ids: [61,62,63,64,65] },
  { unit: 2, label: 'L8', ids: [66,67,68,69,70] },
  { unit: 2, label: 'L9', ids: [71,72,73,74,75] },
  { unit: 2, label: 'L10', ids: [76,77,78,79,80] },
  { unit: 2, label: 'L11', ids: [81,82,83,84,85] },
  { unit: 2, label: 'L12', ids: [86,87,88,89,90] },
  { unit: 2, label: 'L13', ids: [91,92,93,94,95] },
  { unit: 2, label: 'L14', ids: [96,97,98,99,100] },
  { unit: 2, label: 'L15', ids: [101,102,103,104,105] },
  { unit: 2, label: 'L16', ids: [106,107,108,109,110] },
  { unit: 2, label: 'L17', ids: [111,112,113,114,115] },
  { unit: 2, label: 'L18', ids: [116,117,118,119,120] },
  { unit: 2, label: 'L19', ids: [121,122,123,124,125] },
  { unit: 2, label: 'L20', ids: [126,127,128,129,130] },
  { unit: 2, label: 'L21', ids: [131,132,133,134,135] },
  { unit: 2, label: 'L22', ids: [136,137,138,139,140] },
  { unit: 2, label: 'L23', ids: [141,142,143,144,145,146] },
  { unit: 2, label: 'L24', ids: [147,148,149,150,151] },
  { unit: 2, label: 'L25', ids: [152,153,154,155,156] },
  { unit: 2, label: 'L26', ids: [157,158,159,160,161] },
  { unit: 2, label: 'L27', ids: [162,163,164,165,166] },
  { unit: 2, label: 'L28', ids: [167,168,169,170,171] },
  // Unit 3
  { unit: 3, label: 'L1', ids: [172,173,174,175,176,177] },
  { unit: 3, label: 'L2', ids: [178,179,180,181,182] },
  { unit: 3, label: 'L3', ids: [183,184,185,186,187] },
  { unit: 3, label: 'L4', ids: [188,189,190,191,192] },
  { unit: 3, label: 'L5', ids: [193,194,195,196,197] },
  { unit: 3, label: 'L6', ids: [198,199,200,201,202] },
  { unit: 3, label: 'L7', ids: [203,204,205,206,207,208] },
  { unit: 3, label: 'L8', ids: [209,210,211,212,213] },
  { unit: 3, label: 'L9', ids: [214,215,216,217,218] },
  { unit: 3, label: 'L10', ids: [219,220,221,222] },
  { unit: 3, label: 'L11', ids: [223,224,225,226,227] },
  { unit: 3, label: 'L12', ids: [228,229,230,231,232,233] },
  { unit: 3, label: 'L13', ids: [234,235,236,237,238] },
  { unit: 3, label: 'L14', ids: [239,240,241,242,243] },
  { unit: 3, label: 'L15', ids: [244,245,246,247,248] },
  { unit: 3, label: 'L16', ids: [249,250,251,252,253,254,255] },
  { unit: 3, label: 'L17', ids: [256,257,258,259,260] },
  { unit: 3, label: 'L18', ids: [261,262,263,264,265] },
  { unit: 3, label: 'L19', ids: [266,267,268,269] },
  { unit: 3, label: 'L20', ids: [270,271,272,273,274] },
  { unit: 3, label: 'L21', ids: [275,276,277,278,279] },
  { unit: 3, label: 'L22', ids: [280,281,282,283] },
  { unit: 3, label: 'L23', ids: [284,285,286,287,288] },
  { unit: 3, label: 'L24', ids: [289,290,291,292,293,294] },
  { unit: 3, label: 'L25', ids: [295,296,297,298,299] },
  // Unit 4
  { unit: 4, label: 'L1',  ids: [300,301,302,303,304] },
  { unit: 4, label: 'L2',  ids: [305,306,307,308,309] },
  { unit: 4, label: 'L3',  ids: [310,311,312,313,314] },
  { unit: 4, label: 'L4',  ids: [315,316,317,318,319] },
  { unit: 4, label: 'L5',  ids: [320,321,322,323,324] },
  { unit: 4, label: 'L6',  ids: [325,326,327,328,329] },
  { unit: 4, label: 'L7',  ids: [330,331,332,333,334] },
  { unit: 4, label: 'L8',  ids: [335,336,337,338,339] },
  { unit: 4, label: 'L9',  ids: [340,341,342,343,344] },
  { unit: 4, label: 'L10', ids: [345,346,347,348,349,350] },
  { unit: 4, label: 'L11', ids: [351,352,353,354,355] },
  { unit: 4, label: 'L12', ids: [356,357,358,359,360] },
  { unit: 4, label: 'L13', ids: [361,362,363,364,365] },
  { unit: 4, label: 'L14', ids: [366,367,368,369,370] },
  { unit: 4, label: 'L15', ids: [371,372,373,374,375] },
  { unit: 4, label: 'L16', ids: [376,377,378,379,380] },
  { unit: 4, label: 'L17', ids: [381,382,383,384,385] },
  { unit: 4, label: 'L18', ids: [386,387,388,389,390] },
  { unit: 4, label: 'L19', ids: [391,392,393,394,395] },
  { unit: 4, label: 'L20', ids: [396,397,398,399,400] },
  { unit: 4, label: 'L21', ids: [401,402,403,404,405,406] },
  { unit: 4, label: 'L22', ids: [407,408,409,410,411] },
  { unit: 4, label: 'L23', ids: [412,413,414,415,416] },
  { unit: 4, label: 'L24', ids: [417,418,419,420,421,422] },
  { unit: 4, label: 'L25', ids: [423,424,425,426,427] },
  { unit: 4, label: 'L26', ids: [428,429,430,431,432] },
  { unit: 4, label: 'L27', ids: [433,434,435,436,437] },
  { unit: 4, label: 'L28', ids: [438,439,440,441,442,443] },
  { unit: 4, label: 'L29', ids: [444,445,446,447,448,449] },
  { unit: 4, label: 'L30', ids: [450,451,452,453,454,455] },
  { unit: 4, label: 'L31', ids: [456,457,458,459,460] },
  { unit: 4, label: 'L32', ids: [461,462,463,464,465,466] },
  { unit: 4, label: 'L33', ids: [467,468,469,470,471,472] },
  { unit: 4, label: 'L34', ids: [473,474,475,476,477,478] },
  { unit: 4, label: 'L35', ids: [479,480,481,482,483,484] },
  { unit: 4, label: 'L36', ids: [485,486,487,488,489,490] },
  { unit: 4, label: 'L37', ids: [491,492,493,494,495] },
  { unit: 4, label: 'L38', ids: [496,497,498,499,500,501] },
  { unit: 4, label: 'L39', ids: [502,503,504,505,506,507] },
  { unit: 4, label: 'L40', ids: [508,509,510,511,512,513] },
  { unit: 4, label: 'L41', ids: [514,515,516,517,518,519] },
  { unit: 4, label: 'L42', ids: [520,521,522,523,524] },
  { unit: 4, label: 'L43', ids: [525,526,527,528,529] },
  { unit: 4, label: 'L44', ids: [530,531,532,533,534] },
  { unit: 4, label: 'L45', ids: [535,536,537,538,539] },
  { unit: 4, label: 'L46', ids: [540,541,542,543,544,545] },
  { unit: 4, label: 'L47', ids: [546,547,548,549,550] },
  { unit: 4, label: 'L48', ids: [551,552,553,554,555] },
  { unit: 4, label: 'L49', ids: [556,557,558,559,560,561] },
  { unit: 4, label: 'L50', ids: [562,563,564,565,566] },
  { unit: 4, label: 'L51', ids: [567,568,569,570,571] },
  { unit: 4, label: 'L52', ids: [572,573,574,575,576] },
  { unit: 4, label: 'L53', ids: [577,578,579,580,581] },
  { unit: 4, label: 'L54', ids: [582,583,584,585,586] },
  { unit: 4, label: 'L55', ids: [587,588,589,590,591] },
  // Unit 5
  { unit: 5, label: 'L1',  ids: [592,593,594,595,596,597] },
  { unit: 5, label: 'L2',  ids: [598,599,600,601,602,603] },
  { unit: 5, label: 'L3',  ids: [604,605,606,607,608,609] },
  { unit: 5, label: 'L4',  ids: [610,611,612,613,614,615] },
  { unit: 5, label: 'L5',  ids: [616,617,618,619,620,621] },
  { unit: 5, label: 'L6',  ids: [622,623,624,625,626,627] },
  { unit: 5, label: 'L7',  ids: [628,629,630,631,632,633] },
  { unit: 5, label: 'L8',  ids: [634,635,636,637,638,639] },
  { unit: 5, label: 'L9',  ids: [640,641,642,643,644,645] },
  { unit: 5, label: 'L10', ids: [646,647,648,649,650,651] },
  { unit: 5, label: 'L11', ids: [652,653,654,655,656,657] },
  { unit: 5, label: 'L12', ids: [658,659,660,661,662,663] },
  { unit: 5, label: 'L13', ids: [664,665,666,667,668,669] },
  { unit: 5, label: 'L14', ids: [670,671,672,673,674,675] },
  { unit: 5, label: 'L15', ids: [676,677,678,679,680] },
  { unit: 5, label: 'L16', ids: [681,682,683,684,685] },
  { unit: 5, label: 'L17', ids: [686,687,688,689] },
  { unit: 5, label: 'L18', ids: [690,691,692,693,694,695] },
  { unit: 5, label: 'L19', ids: [696,697,698,699,700] },
  { unit: 5, label: 'L20', ids: [701,702,703,704,705] },
  { unit: 5, label: 'L21', ids: [706,707,708,709,710,711] },
  { unit: 5, label: 'L22', ids: [712,713,714,715,716,717] },
  { unit: 5, label: 'L23', ids: [718,719,720,721,722,723] },
  { unit: 5, label: 'L24', ids: [724,725,726,727,728,729] },
  { unit: 5, label: 'L25', ids: [730,731,732,733,734] },
  { unit: 5, label: 'L26', ids: [735,736,737,738,739,740] },
  { unit: 5, label: 'L27', ids: [741,742,743,744,745] },
  { unit: 5, label: 'L28', ids: [746,747,748,749,750] },
  { unit: 5, label: 'L29', ids: [751,752,753,754] },
  { unit: 5, label: 'L30', ids: [755,756,757,758,759,760] },
  { unit: 5, label: 'L31', ids: [761,762,763,764,765] },
  { unit: 5, label: 'L32', ids: [766,767,768,769,770] },
  // Unit 6
  { unit: 6, label: 'L1',  ids: [771,772,773,774,775] },
  { unit: 6, label: 'L2',  ids: [776,777,778,779,780,781] },
  { unit: 6, label: 'L3',  ids: [782,783,784,785,786,787] },
  { unit: 6, label: 'L4',  ids: [788,789,790,791,792] },
  { unit: 6, label: 'L5',  ids: [793,794,795,796,797] },
  { unit: 6, label: 'L6',  ids: [798,799,800,801,802] },
  { unit: 6, label: 'L7',  ids: [803,804,805,806,807,808] },
  { unit: 6, label: 'L8',  ids: [809,810,811,812,813,814] },
  { unit: 6, label: 'L9',  ids: [815,816,817,818,819] },
  { unit: 6, label: 'L10', ids: [820,821,822,823,824,825] },
  { unit: 6, label: 'L11', ids: [826,827,828,829,830,831,832] },
  { unit: 6, label: 'L12', ids: [833,834,835,836,837,838] },
  { unit: 6, label: 'L13', ids: [839,840,841,842,843,844] },
  { unit: 6, label: 'L14', ids: [845,846,847,848,849,850] },
  { unit: 6, label: 'L15', ids: [851,852,853,854,855] },
  { unit: 6, label: 'L16', ids: [856,857,858,859,860,861] },
  { unit: 6, label: 'L17', ids: [862,863,864,865,866] },
  { unit: 6, label: 'L18', ids: [867,868,869,870] },
  { unit: 6, label: 'L19', ids: [871,872,873,874,875,876] },
  { unit: 6, label: 'L20', ids: [877,878,879,880,881] },
  { unit: 6, label: 'L21', ids: [882,883,884,885,886,887] },
  { unit: 6, label: 'L22', ids: [888,889,890,891,892,893] },
  { unit: 6, label: 'L23', ids: [894,895,896,897] },
  { unit: 6, label: 'L24', ids: [898,899,900,901,902] },
  { unit: 6, label: 'L25', ids: [903,904,905,906,907,908] },
  { unit: 6, label: 'L26', ids: [909,910,911,912,913] },
  { unit: 6, label: 'L27', ids: [914,915,916,917,918] },
  { unit: 6, label: 'L28', ids: [919,920,921,922,923,924] },
  { unit: 6, label: 'L29', ids: [925,926,927,928,929,930] },
  { unit: 6, label: 'L30', ids: [931,932,933,934,935,936] },
  { unit: 6, label: 'L31', ids: [937,938,939,940,941,942] },
  { unit: 6, label: 'L32', ids: [943,944,945,946,947,948] },
  { unit: 6, label: 'L33', ids: [949,950,951,952] },
  { unit: 6, label: 'L34', ids: [953,954,955,956,957] },
  { unit: 6, label: 'L35', ids: [958,959,960,961,962,963] },
  { unit: 6, label: 'L36', ids: [964,965,966,967] },
  { unit: 6, label: 'L37', ids: [968,969,970,971,972] },
  { unit: 6, label: 'L38', ids: [973,974,975,976,977,978] },
  { unit: 6, label: 'L39', ids: [979,980,981,982,983] },
  { unit: 6, label: 'L40', ids: [984,985,986,987] },
  { unit: 6, label: 'L41', ids: [988,989,990,991,992,993] },
  { unit: 6, label: 'L42', ids: [994,995,996,997,998] },
  { unit: 6, label: 'L43', ids: [999,1000,1001,1002,1003] },
  { unit: 6, label: 'L44', ids: [1004,1005,1006,1007,1008] },
  { unit: 6, label: 'L45', ids: [1009,1010,1011,1012,1013,1014] },
  { unit: 6, label: 'L46', ids: [1015,1016,1017,1018,1019,1020] },
  { unit: 6, label: 'L47', ids: [1021,1022,1023,1024,1025] },
  { unit: 6, label: 'L48', ids: [1026,1027,1028,1029,1030,1031] },
  { unit: 6, label: 'L49', ids: [1032,1033,1034,1035,1036] },
  { unit: 6, label: 'L50', ids: [1037,1038,1039,1040,1041] },
  { unit: 6, label: 'L51', ids: [1042,1043,1044,1045] },
  { unit: 6, label: 'L52', ids: [1046,1047,1048,1049,1050] },
]

const idMap = Object.fromEntries(duolingoData.map(s => [s.id, s]))

function getLessonData(ids) {
  return ids.map(id => idMap[id]).filter(Boolean)
}

function getLessonStats(data, progress) {
  const total = data.length
  const attempted = data.filter(s => (progress[`sentence_${s.id}`]?.attempts || 0) > 0).length
  const mastered = data.filter(s => progress[`sentence_${s.id}`]?.status === 'mastered').length
  return { total, attempted, mastered }
}

function LessonStatusBadge({ attempted, mastered, total }) {
  if (mastered === total && total > 0) return <span className="text-xs text-green-400 bg-green-900/40 border border-green-700/50 px-2 py-0.5 rounded-full">已完成</span>
  if (attempted > 0) return <span className="text-xs text-blue-400 bg-blue-900/40 border border-blue-700/50 px-2 py-0.5 rounded-full">进行中</span>
  return <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded-full">待开始</span>
}

const UNIT_INFO = {
  1: { name: 'Unit 1', desc: '入门：喜好、职业、问候', color: 'from-green-600 to-green-800', emoji: '🌱', cover: '/duolingo.webp' },
  2: { name: 'Unit 2', desc: '基础：日常、购物、天气', color: 'from-blue-600 to-blue-800', emoji: '📘', cover: '/duolingo.webp' },
  3: { name: 'Unit 3', desc: '进阶：旅行、比较、过去时', color: 'from-purple-600 to-purple-800', emoji: '🌍', cover: '/duolingo.webp' },
  4: { name: 'Unit 4', desc: '提高：购物、交通、职场', color: 'from-orange-600 to-orange-800', emoji: '🏙️', cover: '/duolingo.webp' },
  5: { name: 'Unit 5', desc: '流利：旅行、职场、社会话题', color: 'from-pink-600 to-pink-800', emoji: '🚀', cover: '/duolingo.webp' },
  6: { name: 'Unit 6', desc: '精通：情感、文化、复杂语法', color: 'from-red-600 to-red-800', emoji: '🎓', cover: '/duolingo.webp' },
}

export default function Courses({ onImport, changyongData, sampleData, onClose, onSetBack, progress = {} }) {
  const [detail, setDetail] = useState(null) // null | 1 | 2

  useEffect(() => {
    onSetBack?.(detail ? () => () => setDetail(null) : null)
  }, [detail, onSetBack])

  if (detail !== null) {
    const info = UNIT_INFO[detail]
    const lessons = DUOLINGO_LESSONS.filter(l => l.unit === detail)
    const allData = lessons.flatMap(l => getLessonData(l.ids))
    const courseStats = getLessonStats(allData, progress)
    const coursePercent = courseStats.total ? Math.round((courseStats.attempted / courseStats.total) * 100) : 0

    return (
      <div className="w-full max-w-5xl mx-auto px-4 py-6">
        <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6 mb-6 flex items-center gap-6">
          <div className="w-24 h-16 rounded-xl overflow-hidden shrink-0">
            <img src={info.cover} alt={info.name} className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-xl font-bold text-white mb-1">多邻国 · {info.name}</div>
            <div className="text-gray-400 text-sm mb-3">{info.desc}</div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-1.5 bg-gray-800 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${coursePercent}%` }} />
              </div>
              <span className="text-xs text-gray-500 tabular-nums shrink-0">{courseStats.attempted}/{courseStats.total} 句</span>
            </div>
          </div>
          <button
            onClick={() => onImport(getLessonData(lessons[0].ids), `多邻国 ${info.name} · ${lessons[0].label}`)}
            className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm transition-colors shrink-0"
          >
            ▶ 开始学习
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {lessons.map((lesson, i) => {
            const data = getLessonData(lesson.ids)
            const stats = getLessonStats(data, progress)
            const percent = stats.total ? Math.round((stats.attempted / stats.total) * 100) : 0
            return (
              <button
                key={i}
                onClick={() => onImport(data, `多邻国 ${info.name} · ${lesson.label}`)}
                className="text-left bg-gray-900 border border-gray-800 hover:border-gray-600 rounded-xl p-4 flex flex-col gap-3 transition-colors"
              >
                <div className="flex items-start justify-between">
                  <span className="text-white text-sm font-medium">{lesson.label}</span>
                  <LessonStatusBadge {...stats} />
                </div>
                <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${stats.mastered === stats.total && stats.total > 0 ? 'bg-green-500' : 'bg-blue-500'}`}
                    style={{ width: `${percent}%` }}
                  />
                </div>
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{stats.attempted}/{stats.total} 句</span>
                  <span className="text-gray-600 font-mono">#{i + 1}</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-5xl mx-auto px-4 py-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-bold text-white">课程广场</h2>
        <span className="text-xs text-gray-500">多邻国课程</span>
      </div>

      <div className="text-xs text-gray-600 mb-3 uppercase tracking-wider">多邻国课程</div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4, 5, 6].map(unit => {
          const info = UNIT_INFO[unit]
          const lessons = DUOLINGO_LESSONS.filter(l => l.unit === unit)
          const allData = lessons.flatMap(l => getLessonData(l.ids))
          const stats = getLessonStats(allData, progress)
          const percent = stats.total ? Math.round((stats.attempted / stats.total) * 100) : 0
          return (
            <button
              key={unit}
              onClick={() => setDetail(unit)}
              className="flex flex-col rounded-2xl overflow-hidden border border-gray-700 hover:border-gray-500 cursor-pointer transition-all text-left"
            >
              <div className="w-full h-28 overflow-hidden">
                <img src={info.cover} alt={info.name} className="w-full h-full object-cover" />
              </div>
              <div className="bg-gray-900 p-3 flex flex-col gap-1">
                <div className="text-sm font-medium text-white">多邻国 · {info.name}</div>
                <div className="text-xs text-gray-500 truncate">{info.desc}</div>
                <div className="w-full h-1 bg-gray-800 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-blue-500 rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                </div>
                <div className="text-xs text-gray-600">{lessons.length} 课 · {percent}%</div>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
