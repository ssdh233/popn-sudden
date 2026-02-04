import { FormField, Divider, Header, Button, Form, Modal, ModalHeader, ModalContent, TabPane, Checkbox, Icon, Input } from 'semantic-ui-react'
import { useEffect, useState, useRef } from 'react';

function Page() {
  const [high, setHigh] = useState("");
  const [low, setLow] = useState("");
  const [roof, setRoof] = useState(0);
  const [lift, setLift] = useState(0);

  const [inverse, setInverse] = useState(false);
  const [inverseSudden, setInverseSudden] = useState(0);

  const highNum = Number(high);
  const lowNum = Number(low);
  const roofNum = inverse ? Number(inverseSudden) + 287 : Number(roof);
  const liftNum = Number(lift);

  useEffect(() => {
    setHigh(localStorage.getItem("high") || "");
    setLow(localStorage.getItem("low") || "");
    setRoof(localStorage.getItem("roof") || 0);
    setLift(localStorage.getItem("lift") || 0);
    setInverse(localStorage.getItem("inverse") === "true" || false);
    setInverseSudden(localStorage.getItem("inverseSudden") || 0);
  }, [])

  const sudden = (102 + liftNum) - (inverse ? highNum / lowNum : lowNum / highNum) * (389 + liftNum - roofNum);

  const [isStandalone, setIsStandalone] = useState("init");

  const [showIosAddToHomeDialog, setShowIosAddToHomeDialog] = useState(false);
  const [addToHomeSuccessDialog, setAddToHomeSuccessDialog] = useState(false);

  const [showInverseExplanation, setShowInverseExplanation] = useState(false);

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
  }, []);

  console.log({ lowNum, highNum, check: lowNum > highNum })

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
          <FormField inline style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingRight: 16 }}>
            <label style={{ fontSize: 16, color: (inverse && sudden + 287) < 0 ? "red" : undefined }}>{inverse ? "ROOF" : "SUDDEN+"}</label>
            <label style={{ fontSize: 28, color: (inverse && sudden + 287) < 0 ? "red" : undefined }} >{inverse ? (sudden + 287).toFixed(1) : sudden.toFixed(1)}</label>
          </FormField>
        </TabPane>
        <FormField inline style={{ transform: inverse ? "translateY(52px)" : "translateY(0px)", transition: "transform 0.3s ease" }}>
          <label style={{ width: 42 }}>高BPM</label>
          <Input type="number" placeholder='0' value={high} onChange={event => {
            setHigh(event.target.value);
            localStorage.setItem("high", event.target.value);
          }} />
        </FormField>
        <FormField error={lowNum > highNum || lowNum <= 0} inline style={{ transform: inverse ? "translateY(-52px)" : "translateY(0px)", transition: "transform 0.3s ease" }}>
          <label style={{ width: 42 }}>低BPM</label>
          <Input type="number" placeholder='0' value={low} onChange={event => {
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
        {!inverse && <FormField inline error={roof > 400 || roof < 0}>
          <label style={{ width: 42 }}>ROOF</label>
          <input type="number" placeholder='0' value={roof} onChange={event => {
            setRoof(event.target.value);
            localStorage.setItem("roof", event.target.value);
          }} />
        </FormField>
        }
        {inverse && <>
          <FormField inline>
            <label style={{ width: 42 }}>SUD</label>
            <input type="number" placeholder='0' value={inverseSudden} onChange={event => {
              setInverseSudden(event.target.value);
              localStorage.setItem("inverseSudden", event.target.value);
            }} />
          </FormField>
          <FormField inline>
            <label>ROOF換算</label>
            <label>{(Number(inverseSudden) + 287).toFixed(1)}</label>
          </FormField>
        </>
        }
        <FormField inline error={lift < -200}>
          <label style={{ width: 42 }}>LIFT</label>
          <input type="number" placeholder='0' value={lift} onChange={event => {
            setLift(event.target.value > 0 ? -event.target.value : event.target.value);
            localStorage.setItem("lift", event.target.value);
          }} />
        </FormField>
      </Form>
      <div style={{ marginTop: 24, display: "flex", alignItems: "center" }}>
        <Checkbox label="低BPMをベースにする" checked={inverse} onChange={(_, data) => {
          setInverse(data.checked);
          localStorage.setItem("inverse", data.checked);
          if (data.checked) {
            setInverseSudden((Number(roof) - 287).toFixed(0));
            localStorage.setItem("inverseSudden", (Number(roof) - 287).toFixed(0));
          } else {
            setRoof((Number(inverseSudden) + 287).toFixed(0));
            localStorage.setItem("roof", (Number(inverseSudden) + 287).toFixed(0));
          }
        }} />
        <div onClick={() => setShowInverseExplanation(true)}>
          <Icon name="question circle outline"></Icon>
        </div>
      </div>
      <Modal open={showInverseExplanation} onClose={() => setShowInverseExplanation(false)}>
        <ModalHeader>「低BPMをベースにする」の使い所</ModalHeader>
        <ModalContent>
          普段はROOFを多めに付けてプレイしているプレイヤーに、ベースは低BPMだけどちょっとだけ高BPM地帯がある曲（例: 放課後コンチェルティーノ～私だけの部室狂騒曲）を、<strong>普段付けているROOFの高さをSUDDEN+で維持して、高速地帯はSUDDEN+を外してROOFでやる</strong>時に、
          <br /><br />1. 普段のROOFと同じ高さのSUDを設定する（例えば普段ROOF50の場合はSUDに-237を入力）
          <br />2. （ 放課後コンチェルティーノの場合）低BPMに190、高BPMに208を入力し、高BPMな時に必要なROOF値を計算
          <br /><br />という使い方を想定しています。
        </ModalContent>
      </Modal>
      <Button as="a" href="/popn-sudden/explanation" style={{ marginTop: 24 }}>計算式説明</Button>
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
    </main>
  </>
}

export default Page;