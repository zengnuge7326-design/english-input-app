import { useRef, useState } from 'react'

function parseJSON(text) {
  const data = JSON.parse(text)
  if (!Array.isArray(data)) throw new Error('JSON must be an array')
  return data.map((item, i) => ({
    id: item.id ?? i + 1,
    zh: String(item.zh || ''),
    en: String(item.en || ''),
  })).filter(item => item.zh && item.en)
}

function parseCSV(text) {
  const lines = text.trim().split('\n')
  const header = lines[0].split(',').map(h => h.trim().toLowerCase())
  const idIdx = header.indexOf('id')
  const zhIdx = header.indexOf('zh')
  const enIdx = header.indexOf('en')
  if (zhIdx === -1 || enIdx === -1) throw new Error('CSV must have zh and en columns')
  return lines.slice(1).map((line, i) => {
    const cols = line.split(',')
    return {
      id: idIdx >= 0 ? Number(cols[idIdx]) || i + 1 : i + 1,
      zh: cols[zhIdx]?.trim() || '',
      en: cols[enIdx]?.trim() || '',
    }
  }).filter(item => item.zh && item.en)
}

function parseText(text) {
  // Auto-detect JSON or CSV
  const trimmed = text.trim()
  if (trimmed.startsWith('[') || trimmed.startsWith('{')) {
    return parseJSON(trimmed)
  }
  return parseCSV(trimmed)
}

export default function ImportPanel({ onImport, currentCount }) {
  const fileRef = useRef(null)
  const [pasteText, setPasteText] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const text = ev.target.result
        const data = file.name.endsWith('.csv') ? parseCSV(text) : parseJSON(text)
        if (data.length === 0) throw new Error('没有找到有效句子')
        setError('')
        setSuccess(`成功导入 ${data.length} 条句子`)
        onImport(data)
      } catch (err) {
        setError('导入失败: ' + err.message)
        setSuccess('')
      }
    }
    reader.readAsText(file)
    e.target.value = ''
  }

  function handlePaste() {
    if (!pasteText.trim()) return
    try {
      const data = parseText(pasteText)
      if (data.length === 0) throw new Error('没有找到有效句子')
      setError('')
      setSuccess(`成功导入 ${data.length} 条句子`)
      setPasteText('')
      onImport(data)
    } catch (err) {
      setError('解析失败: ' + err.message)
      setSuccess('')
    }
  }

  return (
    <div className="flex flex-col gap-5 p-5 bg-gray-800 rounded-xl border border-gray-700 w-full">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-bold text-base">导入句子</h3>
        {currentCount > 0 && (
          <span className="text-gray-500 text-xs">当前 {currentCount} 条</span>
        )}
      </div>

      {/* File upload */}
      <div className="flex flex-col gap-2">
        <label className="text-gray-400 text-xs font-semibold uppercase tracking-wide">上传文件</label>
        <button
          onClick={() => fileRef.current?.click()}
          className="w-full px-4 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-sm font-medium transition-colors border border-blue-500"
        >
          📂 选择 JSON / CSV 文件
        </button>
        <input ref={fileRef} type="file" accept=".json,.csv" className="hidden" onChange={handleFile} />
      </div>

      {/* Paste input */}
      <div className="flex flex-col gap-2">
        <label className="text-gray-400 text-xs font-semibold uppercase tracking-wide">粘贴文本</label>
        <textarea
          value={pasteText}
          onChange={e => setPasteText(e.target.value)}
          placeholder={`粘贴 JSON 或 CSV 内容，例如：\n[{"id":1,"zh":"你好","en":"Hello"}]\n\n或 CSV：\nid,zh,en\n1,你好,Hello`}
          rows={6}
          className="w-full px-3 py-2 bg-gray-900 border border-gray-600 rounded-lg text-sm text-gray-300 font-mono resize-none focus:outline-none focus:border-blue-500 placeholder-gray-600"
        />
        <button
          onClick={handlePaste}
          disabled={!pasteText.trim()}
          className="w-full px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-40 text-white rounded-lg text-sm font-medium transition-colors border border-gray-600"
        >
          导入粘贴内容
        </button>
      </div>

      {/* Feedback */}
      {error && <p className="text-red-400 text-sm bg-red-900/30 border border-red-800 rounded-lg px-3 py-2">{error}</p>}
      {success && <p className="text-green-400 text-sm bg-green-900/30 border border-green-800 rounded-lg px-3 py-2">✓ {success}</p>}

      {/* Format hint */}
      <div className="text-gray-600 text-xs border-t border-gray-700 pt-3">
        <p className="font-semibold text-gray-500 mb-1">格式说明</p>
        <p>JSON: <code className="text-gray-400">[{'{'}id, zh, en{'}'}]</code></p>
        <p>CSV: 第一行为 <code className="text-gray-400">id,zh,en</code></p>
      </div>
    </div>
  )
}
