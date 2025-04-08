import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatsCardProps {
  title: string;
  value: string | number;
  changeValue: string;
  icon: string;
  iconBackground: string;
  iconColor: string;
  changeDirection: "up" | "down" | "neutral";
  changeColor: string;
}

export default function StatsCard({
  title,
  value,
  changeValue,
  icon,
  iconBackground,
  iconColor,
  changeDirection,
  changeColor
}: StatsCardProps) {
  return (
    <Card className="bg-app-darker overflow-hidden shadow rounded-lg">
      <div className="px-4 py-5 sm:p-6">
        <div className="flex items-center">
          <div className={cn("flex-shrink-0 rounded-md p-3", iconBackground)}>
            <i className={cn(icon, iconColor)}></i>
          </div>
          <div className="ml-5 w-0 flex-1">
            <dl>
              <dt className="text-sm font-medium text-gray-400 truncate">{title}</dt>
              <dd>
                <div className="text-lg font-medium text-white">{value}</div>
              </dd>
            </dl>
          </div>
        </div>
        <div className="mt-4">
          <div className="flex items-center justify-between">
            <div className={cn("text-sm", changeColor)}>
              <i className={cn(
                changeDirection === "up" 
                  ? "fas fa-arrow-up" 
                  : changeDirection === "down" 
                    ? "fas fa-arrow-down" 
                    : "fas fa-minus"
              )}></i>
              <span className="ml-1">{changeValue}</span>
              {" "}
              {changeDirection === "up" ? "increase" : changeDirection === "down" ? "decrease" : "no change"}
            </div>
            <div className="text-sm text-gray-400">vs last week</div>
          </div>
        </div>
      </div>
    </Card>
  );
}
