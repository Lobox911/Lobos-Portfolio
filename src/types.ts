import React from 'react';

export interface Project {
  id: string;
  year: string;
  name: string;
  subtitle: string;
  stack: string[];
  url: string;
  isLive: boolean;
  description: string;
  challenge?: string;
  solution?: string;
  result?: string;
  keyFeatures?: string[];
  architecture?: {
    frontend?: string;
    backend?: string;
    database?: string;
    infra?: string;
  };
}

export interface Service {
  id: string;
  n: string;
  title: string;
  description: string;
}

export interface LogLine {
  id: string;
  time: string;
  type: 'deploy' | 'test' | 'compile' | 'success' | 'pending' | 'info';
  name: string;
  note: string;
  status: 'ok' | 'pending' | 'info' | 'error';
}

export interface ProposalModule {
  id: string;
  title: string;
  description: string;
  baseDays: number;
  basePrice: number;
  category: 'core' | 'addon' | 'integration';
}

export interface TerminalCommand {
  command: string;
  output: string | React.ReactNode;
}
