import { NextResponse } from 'next/server'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

let cache: any = null // 在内存中缓存数据

// 读取并缓存 pickle 文件数据
async function loadData() {
  if (!cache) {
    try {
      const { stdout, stderr } = await execAsync('python3 script.py load') // 调用 Python 加载文件
      if (stderr) {
        console.error('stderr:', stderr)
        return { error: stderr }
      }
      cache = JSON.parse(stdout) // 缓存数据
    } catch (error) {
      console.error('Error:', error)
      return { error: 'An error occurred while loading data.' }
    }
  }
  return cache // 返回缓存的数据
}

export async function POST(req: Request) {
  const { input } = await req.json()

  try {
    const data = await loadData() // 获取缓存数据

    if (data.error) {
      return NextResponse.json({ error: data.error }, { status: 500 })
    }

    // 传递用户输入给 Python 脚本
    const { stdout, stderr } = await execAsync(`python3 script.py "${input}"`) // 调用 Python 查询
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
      { error: 'An error occurred while processing your request.' },
      { status: 500 }
    )
  }
}
