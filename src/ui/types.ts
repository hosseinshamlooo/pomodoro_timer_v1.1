export interface FocusSession {
  id: string;
  startTime: number;
  endTime: number;
  duration: number;
  label: string;
  interrupted: boolean;
}