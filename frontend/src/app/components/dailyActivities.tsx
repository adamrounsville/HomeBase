import { Place } from "@/lib/utils";
import { Button } from "@/components/ui/button";

interface DailyActivitiesProps {
  dailyPlan: Place[];
  setDailyPlan: (activities: Place[]) => void;
}

const DailyActivities = ({ dailyPlan, setDailyPlan }: DailyActivitiesProps) => {
  // Handler to clear the daily plan
  const clearDailyPlan = () => setDailyPlan([]);

  return (
    <div className="daily-activities-container">
      <h2 className="text-xl font-bold mb-4">Daily Plan</h2>

      {/* Display Daily Plan Activities */}
      <div className="daily-plan-list mb-6">
        {dailyPlan.length > 0 ? (
          dailyPlan.map((activity) => (
            <div
              key={activity.Place_ID}
              className="daily-plan-item bg-gray-100 p-4 rounded-lg mb-2"
            >
              <h3 className="text-lg font-medium">{activity.Name}</h3>
              <p className="text-sm text-gray-600">{activity.Address}</p>
              <button
                className="text-red-500 text-sm"
                onClick={() =>
                  setDailyPlan(
                    dailyPlan.filter((a) => a.Place_ID !== activity.Place_ID)
                  )
                }
              >
                Remove
              </button>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center">
            <p className="text-sm text-gray-500 mb-4">
              No activities added to your daily plan yet.
            </p>
            <Button onClick={clearDailyPlan} variant="outline">
              Add to Daily Plan
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyActivities;
