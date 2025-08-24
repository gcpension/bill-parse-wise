export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3,
}

interface LogEntry {
  timestamp: string;
  level: LogLevel;
  message: string;
  context?: string;
  data?: any;
  stack?: string;
}

class Logger {
  private logs: LogEntry[] = [];
  private maxLogs = 1000;
  private isDevelopment = import.meta.env.DEV;

  private shouldLog(level: LogLevel): boolean {
    if (this.isDevelopment) return true;
    return level <= LogLevel.WARN; // Only log warnings and errors in production
  }

  private createLogEntry(level: LogLevel, message: string, context?: string, data?: any): LogEntry {
    return {
      timestamp: new Date().toISOString(),
      level,
      message,
      context,
      data,
      stack: level === LogLevel.ERROR ? new Error().stack : undefined,
    };
  }

  private addToQueue(entry: LogEntry) {
    this.logs.push(entry);
    if (this.logs.length > this.maxLogs) {
      this.logs.shift();
    }
  }

  error(message: string, context?: string, data?: any) {
    const entry = this.createLogEntry(LogLevel.ERROR, message, context, data);
    this.addToQueue(entry);
    
    if (this.shouldLog(LogLevel.ERROR)) {
      console.error(`[ERROR] ${context ? `[${context}] ` : ''}${message}`, data);
    }
  }

  warn(message: string, context?: string, data?: any) {
    const entry = this.createLogEntry(LogLevel.WARN, message, context, data);
    this.addToQueue(entry);
    
    if (this.shouldLog(LogLevel.WARN)) {
      console.warn(`[WARN] ${context ? `[${context}] ` : ''}${message}`, data);
    }
  }

  info(message: string, context?: string, data?: any) {
    const entry = this.createLogEntry(LogLevel.INFO, message, context, data);
    this.addToQueue(entry);
    
    if (this.shouldLog(LogLevel.INFO)) {
      console.log(`[INFO] ${context ? `[${context}] ` : ''}${message}`, data);
    }
  }

  debug(message: string, context?: string, data?: any) {
    const entry = this.createLogEntry(LogLevel.DEBUG, message, context, data);
    this.addToQueue(entry);
    
    if (this.shouldLog(LogLevel.DEBUG)) {
      console.debug(`[DEBUG] ${context ? `[${context}] ` : ''}${message}`, data);
    }
  }

  getLogs(): LogEntry[] {
    return [...this.logs];
  }

  clearLogs() {
    this.logs = [];
  }

  exportLogs(): string {
    return JSON.stringify(this.logs, null, 2);
  }
}

export const logger = new Logger();