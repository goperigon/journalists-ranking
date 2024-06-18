import { Journalist } from "@/types/journalist";
import { Source } from "@/types/source";
import {
  BarChart,
  Bar,
  Rectangle,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Brush,
} from "recharts";
import numeral from "numeral";
import { useTheme } from "next-themes";
import { useConfig } from "@/hooks/use-config";
import { themes } from "@/lib/theme";
import { useMemo } from "react";
import { JournalistSource } from "@/types/journalistSource";
import { Article } from "@/types/article";

interface JournalistsReachChartProps {
  journalistSourcesWithArticles: Array<
    JournalistSource & { articles: Article[] }
  >;
}

const JournalistInfoToolTipContent = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="flex flex-col bg-slate-200 dark:bg-gray-800 rounded-lg px-6 py-4">
        <h2 className="text-center font-bold mb-4">Details</h2>
        <p>
          <b>Name:</b> {payload[0].payload.journalist.name}
        </p>
        <p>
          <b>Title:</b> {payload[0].payload.journalist.title}
        </p>
        <p>
          <b>Reach:</b> {numeral(payload[0].payload.reach).format("0.00a")} (
          {payload[0].payload.reach}) monthly visitors
        </p>
      </div>
    );
  }

  return null;
};

export function JournalistsReachChart(props: JournalistsReachChartProps) {
  const { theme: mode } = useTheme();
  const [config] = useConfig();
  const theme = themes.find((theme) => theme.name === config.theme);

  const { journalistSourcesWithArticles } = props;

  const filteredJournalistSources = useMemo(
    () =>
      journalistSourcesWithArticles.filter((item) => item.articles.length > 0),
    [journalistSourcesWithArticles]
  );

  const sortedJournalistSources = useMemo(
    () => filteredJournalistSources.sort((a, b) => b.reach - a.reach),
    [filteredJournalistSources]
  );

  return (
    <div className="flex-col w-full max-w-screen-lg h-[550px] hidden lg:flex">
      <h2 className="text-lg font-semibold mb-4">Top 10 Journalists Ranking</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={sortedJournalistSources.slice(0, 9)}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 100,
          }}
        >
          <CartesianGrid className="opacity-10" />
          <XAxis
            dataKey={(data) => {
              const [firstName, lastName] = data.journalist.name.split(" ");
              return `${firstName} ${lastName}`;
            }}
            tick={{
              stroke:
                theme?.cssVars[mode === "dark" ? "dark" : "light"].primary,
              fontSize: 15,
              fontWeight: 500,
            }}
            tickFormatter={(tick) => {
              return tick;
            }}
            minTickGap={-200}
            padding={{ left: 40, right: 30 }}
            tickMargin={32}
            angle={45}
            dx={15}
            dy={20}
          />
          <YAxis
            allowDataOverflow={true}
            tick={{
              stroke:
                theme?.cssVars[mode === "dark" ? "dark" : "light"].primary,
              fontWeight: 600,
            }}
            tickMargin={10}
            tickFormatter={(tick) => {
              return numeral(tick).format("0.0a").toUpperCase();
            }}
          />
          <Tooltip
            content={<JournalistInfoToolTipContent />}
            cursor={{
              style: {
                fill: mode === "dark" ? "#131313" : "#efefef",
              } as React.CSSProperties,
            }}
          />
          <Bar
            dataKey="reach"
            label="Reach"
            barSize={40}
            // fill="#8884d8"
            // activeBar={<Rectangle fill="pink" stroke="blue" />}
            style={
              {
                fill: "var(--theme-primary)",
                opacity: 1,
                "--theme-primary": `hsl(${
                  theme?.cssVars[mode === "dark" ? "dark" : "light"].primary
                })`,
                borderRadius: 10,
              } as React.CSSProperties
            }
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
