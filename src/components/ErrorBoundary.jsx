import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error }
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center">
          <div className="text-4xl mb-4">😿</div>
          <h2 className="text-xl font-bold mb-2">程序出现意外错误</h2>
          <p className="text-gray-400 text-sm mb-4">这可能是由于数据加载或渲染问题导致的。</p>
          <pre className="mt-2 p-4 bg-gray-900 border border-gray-800 rounded-xl text-xs text-red-400 max-w-full overflow-auto text-left">
            {this.state.error?.toString()}
          </pre>
          <div className="flex gap-4 mt-8">
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-2xl transition-colors font-medium text-white"
            >
              刷新重试
            </button>
            <button 
              onClick={() => {
                if (this.props.onClose) this.props.onClose()
                else window.location.hash = '' 
                this.setState({ hasError: false })
              }}
              className="px-8 py-3 bg-gray-800 hover:bg-gray-700 rounded-2xl transition-colors font-medium text-white"
            >
              返回首页
            </button>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}

export default ErrorBoundary
