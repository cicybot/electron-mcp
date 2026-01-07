
import React from 'react';
import { RpcProvider } from './RpcContext';
import { Dashboard } from './Dashboard';

export const  Windows =  ()=>{
    return <RpcProvider>
        <Dashboard />
    </RpcProvider>
}