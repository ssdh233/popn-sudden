import { Button } from "semantic-ui-react";

function Page() {
    return <main style={{ padding: 8 }}>
        <p>
            前提として、ROOF、LIFT、SUDDEN+の数値は「ポップン単位」とします。
        </p>
        <p>
            ROOFが0、LIFTが0の場合、ポップンのレーンの高さは389ポップン単位です。つまり、ROOFを389に設定すると、天井がちょうど判定ラインの中央に来ます。（ROOFを400まで設定できますが、400にしたら判定ラインの下に行ってしまいます。）
        </p>
        <p>
            SUDDEN+は-270~+80の範囲で設定できますが、-270にしても天井には届かず、具体的に天井まであと17ポップン単位です。そのため、SUDDEN+の値を+287にすると、ROOFの値と同じオフセットになります。
        </p>
        <p>
            <code style={{ fontSize: 12 }}>高BPM / 低BPM = SUDDENなしの高さ / SUDDENありの高さ</code> としたいので、ここで
        </p>
        <p>
            <pre style={{ fontSize: 12 }}>SUDDENなしの高さ = 389 - ROOF + LIFT</pre>
            <pre style={{ fontSize: 12 }}>SUDDENありの高さ = 389 - (SUDDEN + 287) + LIFT</pre>
            で計算できます。
        </p>
        <p>
            方程式を解くと、
            <pre style={{ fontSize: 12 }}>{`SUDDEN = (102 + LIFT) - 低BPM / 高BPM * (389
         + LIFT - ROOF)`}</pre>
            となります。
        </p>
        <p>ただし、見ての通り、これはあくまでBPMとレーンの高さの比例で計算したもので、実際のプレイに必ずしも合うとは限りません。<strong>盲信せず、あくまで一つの目安として参考にしてください。</strong></p>
        <p>間違っている点がありましたら、<a target="_blank" rel="noreferrer" href="https://github.com/ssdh233/popn-sudden/issues">Github</a>か<a target="_blank" rel="noreferrer" href="https://x.com/ssdh233">X(Twitter)</a>でご指摘いただけると助かります。</p>
        <Button as="a" href="/popn-sudden" style={{ marginTop: 24 }}>戻る</Button>
    </main>
}

export default Page;