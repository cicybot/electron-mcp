import {StrictMode} from 'react'
import {createRoot} from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import {Windows} from "./Windows.tsx";


const Inner = ()=>{
    if(location.href.indexOf("render")>-1){
        return <App/>
    }else{
        return <Windows />
    }

}
createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <Inner/>
    </StrictMode>,
)
