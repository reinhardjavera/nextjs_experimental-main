import React, { useEffect, useState, useRef } from "react";
import { Header } from "./Header";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./svar-gantt.css";
import "./svar-gantt-icons.css";
import "wx-react-gantt/dist/gantt.css";
import { info } from "console";

type User = {
  name: string;
};

export interface SvarGanttProps {
  /** INFO : This is compatible with React 18.3.1. */
  Description?: void;

  /** Content - Populate timeline data */
  tasks?: {
    id: number;
    text: string;
    start: Date;
    end: Date;
    duration: number;
    progress: number;
    type: string;
    lazy?: boolean;
  }[];

  /** Header Part - Adjust Timeline Labelling */
  scales?: { unit: string; step: number; format: string }[];

  /** Content - Connect from certain id to another id tasks. **Must provide id for link itself */
  links?: {
    id: number;
    source: number;
    target: number;
    type: "e2e" | "e2s" | "s2s";
  }[];
}

export const SvarGantt: React.FC<SvarGanttProps> = ({
  tasks = [
    {
      id: 20,
      text: "New Task",
      start: new Date(2024, 5, 11),
      end: new Date(2024, 6, 12),
      duration: 1,
      progress: 2,
      type: "task",
      lazy: false,
    },
  ],
  links = [{ id: 1, source: 20, target: 21, type: "e2e" }],
  scales = [{ unit: "day", step: 1, format: "d" }],
}: SvarGanttProps) => {
  const [user, setUser] = useState<User>();
  const [ganttCmp, setGanttCmp] = useState<any>();
  const ganttRef = useRef<any>(null);

  // Data task untuk Gantt Chart
  {
    /*
  const taskz = [
    {
      id: 20,
      text: "New Task",
      start: new Date(2024, 5, 11),
      end: new Date(2024, 6, 12),
      duration: 1,
      progress: 2,
      type: "task",
      lazy: false,
    },
    {
      id: 47,
      text: "[1] Master project",
      start: new Date(2024, 5, 12),
      end: new Date(2024, 7, 12),
      duration: 8,
      progress: 0,
      parent: 0,
      type: "summary",
    },
    {
      id: 22,
      text: "Task",
      start: new Date(2024, 7, 11),
      end: new Date(2024, 8, 12),
      duration: 8,
      progress: 0,
      parent: 47,
      type: "task",
    },
    {
      id: 21,
      text: "New Task 2",
      start: new Date(2024, 7, 10),
      end: new Date(2024, 8, 12),
      duration: 3,
      progress: 0,
      type: "task",
      lazy: false,
    },
  ];
*/
  }

  const linkz = [{ id: 1, source: 20, target: 21, type: "e2e" }];

  const scalez = [
    { unit: "month", step: 1, format: "MMMM yyyy" },
    { unit: "day", step: 1, format: "d" },
  ];

  // Konfigurasi Zoom
  const zoomConfig = {
    level: 2,
    maxCellWidth: 350, // max width timeline
    levels: [
      {
        minCellWidth: 180,
        scales: [{ unit: "year", step: 1, format: "yyyy" }],
      },
      {
        minCellWidth: 150,
        scales: [
          { unit: "year", step: 1, format: "yyyy" },
          { unit: "quarter", step: 1, format: "QQQQ" },
        ],
      },
      {
        minCellWidth: 120,
        scales: [
          { unit: "quarter", step: 1, format: "QQQQ" },
          { unit: "month", step: 1, format: "MMMM yyyy" },
        ],
      },
      {
        minCellWidth: 100,
        scales: [
          { unit: "month", step: 1, format: "MMMM yyyy" },
          { unit: "week", step: 1, format: "'Week' w" },
        ],
      },
      {
        minCellWidth: 50,
        scales: [
          { unit: "month", step: 1, format: "MMMM yyyy" },
          { unit: "day", step: 1, format: "d" },
        ],
      },
    ],
  };

  useEffect(() => {
    import("wx-react-gantt").then((x) => {
      console.log("Gantt ref", x);
      setGanttCmp(x);
    });
  }, []);

  {
    /*
  useEffect(() => {
    if (ganttRef.current) {
      console.log("Gantt instance:", ganttRef.current);

      const api = ganttRef.current.getApi
        ? ganttRef.current.getApi()
        : ganttRef.current.api;

      if (api) {
        console.log("Gantt API founded:", api);

        // event listener
        api.on("add-task", (task: any) => {
          console.log("Task added via API", task);
        });

        setGanttCmp(api);
      } else {
        console.error("Gantt API tidak ditemukan di instance");
      }
    } else {
      console.error("ganttRef.current masih undefined!");
    }
  }, [ganttCmp]);
  */
  }

  const showToast = (
    message: string,
    type: "success" | "error" | "info" = "info"
  ) => {
    toast[type](message, {
      position: "bottom-right",
      autoClose: 3000,
      hideProgressBar: false,
    });
  };

  const fninit = (api: any) => {
    if (api) console.log("Gantt API founded:", api);

    api.on("add-link", (data: any) => {
      console.log("Link added via API", data);
      showToast("New Link Added", "success");
    });
    api.on("add-task", (task: any) => {
      console.log("Task added via API", task);
      showToast(`Task Added: ${task.text || "Unknown Task"}`, "success");
    });
    api.on("copy-task", (task: any) => {
      console.log("Task copied via API", task);
      showToast(`Task Copied: ${task.text || "Unknown Task"}`, "info");
    });
    api.on("delete-link", (data: any) => {
      console.log("Link deleted via API", data);
      showToast("Link Deleted", "error");
    });
    api.on("delete-task", (task: any) => {
      console.log("Task deleted via API", task);
      showToast(`Task Deleted: ${task.text || "Unknown Task"}`, "error");
    });
    api.on("drag-task", (task: any) => {
      console.log("Task dragged via API", task);
      showToast(`Task Dragged: ${task.text || "Unknown Task"}`, "success");
    });
    api.on("expand-scale", (scale: any) => {
      console.log("Scale expanded via API", scale);
      showToast(`Scale Expanded: ${scale.format}`, "info");
    });
    api.on("indent-task", (task: any) => {
      console.log("Task indented via API", task);
      showToast(`Task Indented: ${task.text || "Unknown Task"}`, "success");
    });
    api.on("move-task", (task: any) => {
      console.log("Task moved via API", task);
      showToast(`Task Moved: ${task.text || "Unknown Task"}`, "success");
    });
    api.on("open-task", (task: any) => {
      console.log("Task opened via API", task);
      showToast(`Task Opened: ${task.text || "Unknown Task"}`, "info");
    });
    api.on("provide-data", (data: any) => {
      console.log("Data provided via API", data);
      showToast("Data Provided", "info");
    });
    api.on("request-data", (data: any) => {
      console.log("Data requested via API", data);
      showToast("Data Requested", "info");
    });
    api.on("render-data", (data: any) => {
      console.log("Data rendered via API", data);
      showToast("Data Rendered", "info");
    });
    api.on("scroll-chart", (data: any) => {
      console.log("Chart scrolled via API", data);
      showToast("Chart Scrolled", "info");
    });
    api.on("select-task", (task: any) => {
      console.log("Task selected via API", task);
      showToast(`Task Selected: ${task.text || "Unknown Task"}`, "info");
    });
    api.on("show-editor", (data: any) => {
      console.log("Editor shown via API", data);
      showToast("Editor Shown", "info");
    });
    api.on("sort-tasks", (data: any) => {
      console.log("Tasks sorted via API", data);
      showToast("Tasks Sorted", "info");
    });
    api.on("update-link", (data: any) => {
      console.log("Link updated via API", data);
      showToast("Link Updated", "success");
    });
    api.on("update-task", (task: any) => {
      console.log("Task updated via API", task);
      showToast(`Task Updated: ${task.text || "Unknown Task"}`, "success");
    });
    api.on("zoom-scale", (zoomLevel: any) => {
      console.log("Zoom scale changed via API", zoomLevel);
      showToast(`Zoom Scale Changed: ${zoomLevel}`, "info");
    });
  };

  return (
    <article>
      <ToastContainer
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        aria-label="toast"
        style={{ position: "fixed", bottom: "1rem", right: "1rem" }}
      />
      {ganttCmp ? (
        <ganttCmp.Willow>
          <ganttCmp.Gantt
            init={(api: any) => fninit(api)}
            tasks={tasks}
            links={links}
            scales={scales}
            zoom={zoomConfig}
          />
        </ganttCmp.Willow>
      ) : (
        "Memuat..."
      )}
    </article>
  );
};
