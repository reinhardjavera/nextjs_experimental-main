declare module 'quill-better-table' {
    interface GanttProps {
      // Define the props for the Gantt component here
      tasks: any[]; 
      links: any[];
      scales: any[];
      // ... other props
    }
  
    const Gantt: any; 
    export default Gantt;
  }