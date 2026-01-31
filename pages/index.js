import { FormField, Divider, Header, Button, Form } from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import { useEffect, useState, useRef } from 'react';
import Head from 'next/head';

function Page() {
  const [high, setHigh] = useState("");
  const [low, setLow] = useState("");
  const [roof, setRoof] = useState(0);
  const [lift, setLift] = useState(0);

  const highNum = Number(high);
  const lowNum = Number(low);
  const roofNum = Number(roof);
  const liftNum = Number(lift);

  useEffect(() => {
    setHigh(localStorage.getItem("high") || "");
    setLow(localStorage.getItem("low") || "");
    setRoof(localStorage.getItem("roof") || 0);
    setLift(localStorage.getItem("lift") || 0);
  }, [])

  const sudden = (102 + liftNum) - lowNum / highNum * (389 + liftNum - roofNum);

  const [showWarning, setShowWarning] = useState(false);

  const [isStandalone, setIsStandalone] = useState("init");

  useEffect(() => {
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  const deferredPrompt = useRef();

  useEffect(() => {
    console.log("Adding beforeinstallprompt event...")
    window.addEventListener("beforeinstallprompt", (e) => {
      console.log("Calling beforeinstallprompt")
      // 自動表示を止める
      e.preventDefault();
      deferredPrompt.current = e;
    });
  }, [])

  return <>
    <Head>
      <link rel="manifest" href="/manifest.json" />
      <meta name="theme-color" content="#000000" />
      <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
    </Head>
    <main style={{
      maxWidth: 360,
      margin: "auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: 16
    }}><h1 style={{ fontSize: 24, textAlign: "center", margin: 16 }}>ポップン新筐体用<br />SUDDEN+数値計算ツール</h1>
      <Form>
        <FormField inline>
          <label>SUDDEN+</label>
          <label style={{ fontSize: 24 }} >{sudden.toFixed(1)}</label>
        </FormField>
        <FormField inline>
          <label style={{ width: 42 }}>高BPM</label>
          <input type="number" placeholder='0' value={high} onChange={event => {
            setHigh(event.target.value);
            localStorage.setItem("high", event.target.value);
          }} />
        </FormField>
        <FormField inline>
          <label style={{ width: 42 }}>低BPM</label>
          <input type="number" placeholder='0' value={low} onChange={event => {
            setLow(event.target.value);
            localStorage.setItem("low", event.target.value);
          }} />
        </FormField>
      </Form>
      <Divider horizontal>
        <Header as='h4'>
          Option
        </Header>
      </Divider>
      <Form>
        <FormField inline>
          <label style={{ width: 42 }}>ROOF</label>
          <input type="number" placeholder='0' value={roof} onChange={event => {
            setRoof(event.target.value);
            localStorage.setItem("roof", event.target.value);
            if (!showWarning) setShowWarning(true);
          }} />
        </FormField>
        <FormField inline>
          <label style={{ width: 42 }}>LIFT</label>
          <input type="number" placeholder='0' value={lift} onChange={event => {
            setLift(event.target.value);
            localStorage.setItem("lift", event.target.value);
            if (!showWarning) setShowWarning(true);
          }} />
        </FormField>
      </Form>
      {isStandalone !== "init" && !isStandalone &&
        <Button style={{ marginTop: 24 }} onClick={async () => {
          if (!deferredPrompt.current) return;

          deferredPrompt.current.prompt(); // ← これで「ホーム画面に追加」ダイアログ表示
          const { outcome } = await deferredPrompt.current.userChoice;

          console.log("install result:", outcome);
          deferredPrompt.current = null;
        }}>ホーム画面に追加</Button>
      }
      {/* {showWarning &&
            <Message warning>
                <p>ROOF/LIFTの数値を更新したため、現在のリンクをブックマークに追加し直してください。</p>
                <p>ホーム画面に追加した方は何もしなくてOKです。</p>
            </Message>
        } */}
    </main>
  </>
}

export default Page;