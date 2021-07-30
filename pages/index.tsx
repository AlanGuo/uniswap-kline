import Head from "next/head"
import dynamic from "next/dynamic";
import { ethers } from "ethers";
const WrappedCharts = dynamic(() => import("@app/components/WrappedCharts"), { ssr: false });
import abi from "@app/abis/GetPoolInfo.json";
import { useEffect, useRef, useState } from "react";
import { LineData, Time } from "lightweight-charts";

export default function Home() {
  const provider = new ethers.providers.JsonRpcProvider(
    "https://mainnet.infura.io/v3/fcc0477a6eae4d268ff779fb74cff5a7"
  );
  const contractAddress = "0x8E687Da3Db700eCC2F14DAd4e2EFf7201374c43C";
  const poolAddress = "0x1d42064fc4beb5f8aaf85f4617ae8b3b5b8bd801";
  const getPoolInfoContract = new ethers.Contract(
    contractAddress,
    abi.abi,
    provider
  );

  const [klines, setKlines] = useState<LineData[]>([]);
  const wrappedChartsRef: any = useRef();
  wrappedChartsRef.current = {};

  useEffect(() => {
    const step = 13;
    const total = 1000;
    let obArr: number[] = [];
    for(let i=0;i<total;i++) {
      obArr.push((total - i) * step);
    }
    const nowTs = new Date().getTime();
    let tmpKlines: LineData[] = [];
    getPoolInfoContract.getKlinesAtPool(poolAddress, obArr).then(klinesResults => {
      klinesResults.forEach(element => {
        tmpKlines.push({
          time: Math.round(new Date(nowTs - element.secondsAgo * 1000).getTime() / 1000) as Time,
          value: 1 / Number(Math.pow(1.0001, (element.tick / step)).toFixed(6))
        });
      });
      console.log(tmpKlines);
      setKlines(tmpKlines);
    });
  }, []);

  useEffect(() => {
    if (wrappedChartsRef.current && klines.length) {
      wrappedChartsRef.current.createChart(klines);
    }
  }, [klines]);

  return (
    <div className="container">
      <Head>
        <title>Uniswap Klines</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <h1 style={{textAlign: "center", marginTop: "5%"}}>UNISWAP UNI/ETH KLINES</h1>
      <main>
        <WrappedCharts customRef={ wrappedChartsRef } height={500}></WrappedCharts>
      </main>
    </div>
  )
}
