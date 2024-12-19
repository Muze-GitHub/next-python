import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'
import path from 'node:path'

const execAsync = promisify(exec)

const scriptPath = path.resolve('script.py')  // 使用绝对路径

export async function POST(req: Request) {
  const { input } = await req.json()

  try {
    // 传递用户输入给 Python 脚本
    const { stdout, stderr } = await execAsync(`python3 ${scriptPath}  "${input}"`) // 调用 Python 查询
    if (stderr) {
      console.error('stderr:', stderr)
      return NextResponse.json({ error: stderr }, { status: 500 })
    }

    // 解析 Python 脚本的输出结果
    const result = JSON.parse(stdout)
    return NextResponse.json(result)
  } catch (error) {
    console.error('Error:', error)
    return NextResponse.json(
      { error: '请求错误' },
      { status: 500 }
    )
  }
}
