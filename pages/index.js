import { FormField, Divider, Header, Button, Form, Modal, ModalHeader, ModalContent, TabPane } from 'semantic-ui-react'
import { useEffect, useState, useRef } from 'react';

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

  const [showIosAddToHomeDialog, setShowIosAddToHomeDialog] = useState(false);
  const [addToHomeSuccessDialog, setAddToHomeSuccessDialog] = useState(false);

  useEffect(() => {
    setIsStandalone(window.matchMedia("(display-mode: standalone)").matches);
  }, []);

  const deferredPrompt = useRef();

  useEffect(() => {
    window.addEventListener("beforeinstallprompt", (e) => {
      // 自動表示を止める
      e.preventDefault();
      deferredPrompt.current = e;
    });
  }, [])

  return <>
    <main style={{
      maxWidth: 360,
      margin: "auto",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      padding: 16
    }}><h1 style={{ fontSize: 24, textAlign: "center", margin: 16 }}>ポップン新筐体用<br />SUDDEN+数値計算ツール</h1>
      <Form>
        <TabPane style={{ background: "rgba(0,0,0,.05)", margin: "24px 0" }}>
          <FormField inline style={{ display: "flex", alignItems: "center" }}>
            <label style={{ fontSize: 16 }}>SUDDEN+</label>
            <label style={{ fontSize: 28, padding: 8 }} >{sudden.toFixed(1)}</label>
          </FormField>
        </TabPane>
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
          const isIOS = /iPhone|iPad|iPod/.test(navigator.userAgent);

          if (isIOS) {
            setShowIosAddToHomeDialog(true);
          } else {
            if (!deferredPrompt.current) return;

            deferredPrompt.current.prompt(); // ← これで「ホーム画面に追加」ダイアログ表示
            const { outcome } = await deferredPrompt.current.userChoice;

            deferredPrompt.current = null;

            if (outcome === "accepted") {
              setAddToHomeSuccessDialog(true);
            }
          }

        }}>ホーム画面に追加</Button>
      }
      <Modal open={showIosAddToHomeDialog} onClose={() => setShowIosAddToHomeDialog(false)}>
        <ModalHeader>ホーム画面に追加</ModalHeader>
        <ModalContent>
          <p>iOSの場合は、<img style={{ width: 24 }} src="/popn-sudden/icons/share-apple.svg" />ボタンをクリックして、「ホーム画面に追加」で手動で追加してください。</p>
          <p><img style={{ width: 24 }} src="/popn-sudden/icons/share-apple.svg" />は、Safariでは下の中央、Chromeではアドレスバーの右にあります。</p>
        </ModalContent>
      </Modal>
      <Modal open={addToHomeSuccessDialog} onClose={() => setAddToHomeSuccessDialog(false)}>
        <ModalHeader>ホーム画面に追加しました</ModalHeader>
        <ModalContent>
          これからはホーム画面からこのアプリ<img style={{ width: 32 }} src="/icons/icon-192x192.png" />を開いてください。
        </ModalContent>
      </Modal>
      <Button as="a" href="/popn-sudden/explanation" style={{ marginTop: 24 }}>計算式説明</Button>
    </main>
  </>
}

export default Page;