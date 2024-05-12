import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import { Link, MountainIcon, UserIcon } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "./components/ui/card";
import { Button } from "./components/ui/button";
import { createRoot } from "react-dom/client";
import ReactDOM from "react-dom";
import { ResponsiveBar } from "@nivo/bar";
import { ResponsivePie } from "@nivo/pie";
import { ResponsiveLine } from "@nivo/line";
import "./styles.css";
import { data } from "autoprefixer";

const Statistics = () => {
  async function getPopularWebsiteCategories() {
    return new Promise((resolve, reject) => {
      const openRequest = indexedDB.open("EventDatabase12", 2); // Make sure the version matches

      openRequest.onupgradeneeded = function () {
        // Create the database schema if not already existing
        const db = openRequest.result;
        if (!db.objectStoreNames.contains("events")) {
          db.createObjectStore("events", {
            keyPath: "id",
            autoIncrement: true,
          });
        }
      };

      openRequest.onerror = function (event) {
        console.error("Database error: ", openRequest.error);
        reject(openRequest.error);
      };

      openRequest.onsuccess = function () {
        const db = openRequest.result;
        const transaction = db.transaction(["events"], "readonly");
        const store = transaction.objectStore("events");
        const countByCategory = {};

        store.openCursor().onsuccess = function (event) {
          // @ts-ignore
          const cursor = event.target.result;
          if (cursor) {
            if (
              cursor.value.type === "tab-updated" &&
              cursor.value.data &&
              cursor.value.data.category
            ) {
              const category = cursor.value.data.category;
              countByCategory[category] = (countByCategory[category] || 0) + 1;
              cursor.continue();
            } else {
              cursor.continue(); // Continue cursor if not a 'tab-updated' type
            }
          } else {
            // No more entries
            const sorted = Object.keys(countByCategory)
              .filter(
                (category) =>
                  category !== "undefined" &&
                  category !== undefined &&
                  category !== "Browser Extension" &&
                  category !== "Other"
              )
              .map((category) => ({
                category,
                count: countByCategory[category],
              }))
              .sort((a, b) => b.count - a.count);
            console.log(`Popular website categories:`, sorted);
            resolve(sorted);
          }
        };

        transaction.onerror = function (event) {
          console.error("Transaction error:", transaction.error);
          reject(transaction.error);
        };
      };
    });
  }

  async function getMostPopularWebsites() {
    return new Promise((resolve, reject) => {
      const openRequest = indexedDB.open("EventDatabase12", 2);

      openRequest.onerror = function (event) {
        console.error("Database error: ", openRequest.error);
        reject(openRequest.error);
      };

      openRequest.onsuccess = function () {
        const db = openRequest.result;
        const transaction = db.transaction(["events"], "readonly");
        const store = transaction.objectStore("events");
        const countByUrl = {};

        const cursorRequest = store.openCursor();

        cursorRequest.onsuccess = function (event) {
          // @ts-ignore
          const cursor = event.target.result;
          if (cursor) {
            if (cursor.value.type === "tab-updated") {
              const url = cursor.value.data.baseUrl || "Unknown URL";
              countByUrl[url] = (countByUrl[url] || 0) + 1;
              cursor.continue();
            } else {
              cursor.continue(); // Continue cursor if not a 'tab-updated' type
            }
          } else {
            // No more entries
            const sorted = Object.keys(countByUrl)
              .filter(
                (url) =>
                  url !== "undefined" &&
                  url !== undefined &&
                  url !== "Unknown URL"
              )
              ?.map((url) => ({
                url,
                count: countByUrl[url],
              }))
              .sort((a, b) => b.count - a.count);
            resolve(sorted);
          }
        };

        cursorRequest.onerror = function () {
          console.error("Cursor request failed.");
          reject(new Error("Cursor request failed."));
        };
      };
    });
  }
  const [websites, setWebsites] = useState<any[]>([]);

  const [categories, setCategories] = useState<any>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPopularWebsiteCategories()
      .then((categories: any) => {
        setCategories(
          categories.map((category) => {
            return {
              id: category.category,
              value: category.count,
            };
          })
        );
        console.log("Fetched categories:", categories);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch categories:", error);
        setLoading(false);
      });
    getMostPopularWebsites()
      .then((websites: any) => {
        const sites = websites?.map((website) => {
          return {
            name: website.url,
            count: website.count,
          };
        });
        setWebsites(sites);
        console.log("Fetched websites:", sites);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Failed to fetch websites:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }
  return (
    <div className="flex h-screen w-full flex-col">
      <header className="flex h-16 items-center justify-between border-b bg-white px-6 dark:bg-gray-950">
        <div className="flex items-center gap-4">
          <Link className="flex items-center gap-2 font-semibold" href="#">
            <MountainIcon className="h-6 w-6" />
            <span className="text-lg">Analytics</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center gap-2" variant="outline">
                <CalendarClockIcon className="h-4 w-4" />
                <span>Last 30 days</span>
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Time Period</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Last 7 days</DropdownMenuItem>
              <DropdownMenuItem>Last 30 days</DropdownMenuItem>
              <DropdownMenuItem>Last 3 months</DropdownMenuItem>
              <DropdownMenuItem>Last 6 months</DropdownMenuItem>
              <DropdownMenuItem>Last year</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="flex items-center gap-2" variant="outline">
                <UserIcon className="h-4 w-4" />
                <span>John Doe</span>
                <ChevronDownIcon className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>Account</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <main className="flex-1 overflow-auto bg-gray-100 p-6 dark:bg-gray-900">
        <div className="grid gap-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {websites && categories && (
              <>
                <Card>
                  <CardHeader>
                    <CardTitle>Most Popular Websites</CardTitle>
                    <CardDescription>Top websites visited</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <BarChart
                      className="aspect-[4/3]"
                      data={websites.slice(0, 5)}
                    />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <CardTitle>Popular Themes</CardTitle>
                    <CardDescription>
                      Distribution of website themes
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <PieChart className="aspect-square" data={categories} />
                  </CardContent>
                </Card>
              </>
            )}

            <Card>
              <CardHeader>
                <CardTitle>Distractions Count</CardTitle>
                <CardDescription>
                  Number of distractions over time
                </CardDescription>
              </CardHeader>
              <CardContent>
                <LineChart className="aspect-[4/3]" />
              </CardContent>
            </Card>
          </div>
          {websites && (
            <Card>
              <CardHeader>
                <CardTitle>Productive Time</CardTitle>
              </CardHeader>
              <CardContent>
                <BarChart
                  className="aspect-[4/3]"
                  data={websites.slice(0, 9)}
                />
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
};

function BarChart(props: any) {
  return (
    <div {...props}>
      <ResponsiveBar
        data={props.data}
        keys={["count"]}
        indexBy="name"
        margin={{ top: 0, right: 0, bottom: 40, left: 40 }}
        padding={0.3}
        colors={["#2563eb"]}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 4,
          tickPadding: 16,
        }}
        gridYValues={4}
        theme={{
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              stroke: "#f3f4f6",
            },
          },
        }}
        tooltipLabel={({ id }) => `${id}`}
        enableLabel={false}
        role="application"
        ariaLabel="A bar chart showing data"
      />
    </div>
  );
}

function BellIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
      <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
    </svg>
  );
}

function CalendarClockIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M21 7.5V6a2 2 0 0 0-2-2H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h3.5" />
      <path d="M16 2v4" />
      <path d="M8 2v4" />
      <path d="M3 10h5" />
      <path d="M17.5 17.5 16 16.3V14" />
      <circle cx="16" cy="16" r="6" />
    </svg>
  );
}

function ChevronDownIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="m6 9 6 6 6-6" />
    </svg>
  );
}

function LineChart(props: any) {
  return (
    <div {...props}>
      <ResponsiveLine
        data={[
          {
            id: "Desktop",
            data: [
              { x: "Jan", y: 43 },
              { x: "Feb", y: 137 },
              { x: "Mar", y: 61 },
              { x: "Apr", y: 145 },
              { x: "May", y: 26 },
              { x: "Jun", y: 154 },
            ],
          },
          {
            id: "Mobile",
            data: [
              { x: "Jan", y: 60 },
              { x: "Feb", y: 48 },
              { x: "Mar", y: 177 },
              { x: "Apr", y: 78 },
              { x: "May", y: 96 },
              { x: "Jun", y: 204 },
            ],
          },
        ]}
        margin={{ top: 10, right: 10, bottom: 40, left: 40 }}
        xScale={{
          type: "point",
        }}
        yScale={{
          type: "linear",
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 5,
          tickPadding: 16,
        }}
        colors={["#2563eb", "#e11d48"]}
        pointSize={6}
        useMesh={true}
        gridYValues={6}
        theme={{
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              stroke: "#f3f4f6",
            },
          },
        }}
        role="application"
      />
    </div>
  );
}

function Package2Icon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M3 9h18v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z" />
      <path d="m3 9 2.45-4.9A2 2 0 0 1 7.24 3h9.52a2 2 0 0 1 1.8 1.1L21 9" />
      <path d="M12 3v6" />
    </svg>
  );
}

function PieChart(props, data: any) {
  return (
    <div {...props}>
      <ResponsivePie
        data={props.data}
        sortByValue
        margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
        cornerRadius={0}
        padAngle={0}
        borderWidth={1}
        borderColor={"#ffffff"}
        enableArcLinkLabels={false}
        arcLabel={(d) => `${d.id}`}
        arcLabelsTextColor={"#ffffff"}
        arcLabelsRadiusOffset={0.65}
        colors={["#2563eb"]}
        theme={{
          labels: {
            text: {
              fontSize: "18px",
            },
          },
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
        }}
        role="application"
      />
    </div>
  );
}

function TimeseriesChart(props: any) {
  return (
    <div {...props}>
      <ResponsiveLine
        data={[
          {
            id: "Desktop",
            data: [
              { x: "2018-01-01", y: 7 },
              { x: "2018-01-02", y: 5 },
              { x: "2018-01-03", y: 11 },
              { x: "2018-01-04", y: 9 },
              { x: "2018-01-05", y: 12 },
              { x: "2018-01-06", y: 16 },
              { x: "2018-01-07", y: 13 },
            ],
          },
          {
            id: "Mobile",
            data: [
              { x: "2018-01-01", y: 9 },
              { x: "2018-01-02", y: 8 },
              { x: "2018-01-03", y: 13 },
              { x: "2018-01-04", y: 6 },
              { x: "2018-01-05", y: 8 },
              { x: "2018-01-06", y: 14 },
              { x: "2018-01-07", y: 11 },
            ],
          },
        ]}
        margin={{ top: 10, right: 20, bottom: 40, left: 40 }}
        xScale={{
          type: "time",
          format: "%Y-%m-%d",
          useUTC: false,
          precision: "day",
        }}
        xFormat="time:%Y-%m-%d"
        yScale={{
          type: "linear",
          min: 0,
          max: "auto",
        }}
        axisTop={null}
        axisRight={null}
        axisBottom={{
          tickSize: 0,
          tickPadding: 16,
          format: "%d",
          tickValues: "every 1 day",
        }}
        axisLeft={{
          tickSize: 0,
          tickValues: 5,
          tickPadding: 16,
        }}
        colors={["#2563eb", "#e11d48"]}
        pointSize={6}
        useMesh={true}
        gridYValues={6}
        theme={{
          tooltip: {
            chip: {
              borderRadius: "9999px",
            },
            container: {
              fontSize: "12px",
              textTransform: "capitalize",
              borderRadius: "6px",
            },
          },
          grid: {
            line: {
              stroke: "#f3f4f6",
            },
          },
        }}
        role="application"
      />
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);

root.render(
  <React.StrictMode>
    <Statistics />
  </React.StrictMode>
);
