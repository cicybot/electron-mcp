
import React from 'react';
import { createRoot } from 'react-dom/client';
import { RpcProvider } from './RpcContext';
import { Dashboard } from './Dashboard';

const root = createRoot(document.getElementById('root')!);
root.render(
    <RpcProvider>
        <Dashboard />
    </RpcProvider>
);
