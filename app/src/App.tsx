import './App.css'

function App() {
    return (
        <div style={{width:"100vw",height:"100vh"}}>
            <webview partition={"pe"} style={{width:"100%",height:"100%"}} src={"https://www.google.com"} ></webview>
        </div>
    )
}

export default App
