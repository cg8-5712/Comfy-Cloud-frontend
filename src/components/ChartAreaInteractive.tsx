import { useState } from 'react'
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

// Demo data — will be replaced with real API data
const chartData = [
  { date: '2026-01-20', tasks: 12, gpu_minutes: 45 },
  { date: '2026-01-21', tasks: 8, gpu_minutes: 32 },
  { date: '2026-01-22', tasks: 15, gpu_minutes: 58 },
  { date: '2026-01-23', tasks: 22, gpu_minutes: 85 },
  { date: '2026-01-24', tasks: 18, gpu_minutes: 67 },
  { date: '2026-01-25', tasks: 5, gpu_minutes: 20 },
  { date: '2026-01-26', tasks: 3, gpu_minutes: 12 },
  { date: '2026-01-27', tasks: 14, gpu_minutes: 52 },
  { date: '2026-01-28', tasks: 20, gpu_minutes: 78 },
  { date: '2026-01-29', tasks: 25, gpu_minutes: 95 },
  { date: '2026-01-30', tasks: 19, gpu_minutes: 72 },
  { date: '2026-01-31', tasks: 16, gpu_minutes: 60 },
  { date: '2026-02-01', tasks: 10, gpu_minutes: 38 },
  { date: '2026-02-02', tasks: 7, gpu_minutes: 28 },
  { date: '2026-02-03', tasks: 21, gpu_minutes: 80 },
  { date: '2026-02-04', tasks: 17, gpu_minutes: 65 },
  { date: '2026-02-05', tasks: 23, gpu_minutes: 88 },
  { date: '2026-02-06', tasks: 13, gpu_minutes: 50 },
  { date: '2026-02-07', tasks: 9, gpu_minutes: 35 },
  { date: '2026-02-08', tasks: 11, gpu_minutes: 42 },
  { date: '2026-02-09', tasks: 6, gpu_minutes: 24 },
  { date: '2026-02-10', tasks: 19, gpu_minutes: 73 },
  { date: '2026-02-11', tasks: 24, gpu_minutes: 92 },
  { date: '2026-02-12', tasks: 16, gpu_minutes: 61 },
  { date: '2026-02-13', tasks: 20, gpu_minutes: 76 },
  { date: '2026-02-14', tasks: 14, gpu_minutes: 54 },
  { date: '2026-02-15', tasks: 8, gpu_minutes: 30 },
  { date: '2026-02-16', tasks: 18, gpu_minutes: 69 },
  { date: '2026-02-17', tasks: 22, gpu_minutes: 84 },
  { date: '2026-02-18', tasks: 15, gpu_minutes: 57 },
]

const chartConfig = {
  tasks: {
    label: '任务数',
    color: 'hsl(var(--primary))',
  },
  gpu_minutes: {
    label: 'GPU 时长 (分钟)',
    color: 'hsl(var(--primary))',
  },
} satisfies ChartConfig

export function ChartAreaInteractive() {
  const [timeRange, setTimeRange] = useState('30d')

  const filteredData = chartData.filter((item) => {
    const date = new Date(item.date)
    const now = new Date('2026-02-18')
    const diff = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60 * 24))
    if (timeRange === '7d') return diff <= 7
    if (timeRange === '14d') return diff <= 14
    return diff <= 30
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle className="text-base">使用趋势</CardTitle>
          <CardDescription>GPU 使用时长和任务数量</CardDescription>
        </div>
        <Select value={timeRange} onValueChange={setTimeRange}>
          <SelectTrigger className="w-36" aria-label="选择时间范围">
            <SelectValue placeholder="最近 30 天" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="30d">最近 30 天</SelectItem>
            <SelectItem value="14d">最近 14 天</SelectItem>
            <SelectItem value="7d">最近 7 天</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer config={chartConfig} className="aspect-auto h-[250px] w-full">
          <AreaChart data={filteredData}>
            <defs>
              <linearGradient id="fillTasks" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-tasks)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="var(--color-tasks)" stopOpacity={0.1} />
              </linearGradient>
              <linearGradient id="fillGpu" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--color-gpu_minutes)" stopOpacity={0.4} />
                <stop offset="95%" stopColor="var(--color-gpu_minutes)" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value)
                return date.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
              }}
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  labelFormatter={(value) =>
                    new Date(value).toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
                  }
                  indicator="dot"
                />
              }
            />
            <Area
              dataKey="gpu_minutes"
              type="natural"
              fill="url(#fillGpu)"
              stroke="var(--color-gpu_minutes)"
              stackId="a"
            />
            <Area
              dataKey="tasks"
              type="natural"
              fill="url(#fillTasks)"
              stroke="var(--color-tasks)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
