'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function Home() {
  const [input, setInput] = useState('')
  const [result, setResult] = useState<Record<string, string> | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await (await fetch('/api/execute')).json()
      console.log(res,'---ssss')
      const response = await fetch('/api/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input })
      })
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error('Error:', error)
      setResult({ error: 'An error occurred while processing your request.' })
    }
    setLoading(false)
  }

  useEffect(() => {
    const data = result
    console.log(typeof data, '---', data)
  }, [result])

  return (
    <main className="min-h-screen bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-center">
            场景词关联度搜索
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value.trim())}
              placeholder=""
              className="w-full"
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? '搜索中...' : '搜索'}
            </Button>
          </form>
          {result && (
            <div className="mt-8 overflow-hidden rounded-lg shadow-lg">
              <div className="px-4 py-5 sm:p-6 bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg">
                <div className="flow-root h-[calc(100vh-400px)] overflow-y-auto">
                  <ul className="-my-5 divide-y divide-gray-200">
                    {Object.entries(result).map(([key, value]) => (
                      <li key={key} className="py-4">
                        <div className="flex items-center space-x-4">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              {key}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {value}
                            </p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
