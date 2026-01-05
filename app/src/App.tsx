import './App.css'

function App() {
    return (
        <div>
            <h2>local</h2>
            <input type="text" id={"input"}/>
            <div style={{width:"100vw",height:"calc(100vh - 132px)"}}>
                <webview partition={"persist:p_0"} style={{width:"100%",height:"100%"}}
                         src={"https://www.google.com"} ></webview>
            </div>
        </div>
    )
}

export default App
