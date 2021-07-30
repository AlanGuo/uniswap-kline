
import { createChart, LineData } from "lightweight-charts";
import moment from "moment";

export default function WrappedCharts({height, customRef }: {height: number, customRef: {current: any}}) {
  customRef.current.createChart = (data: LineData[]) => {
    const chartInstance = createChart("price-charts", { height });
    chartInstance.applyOptions({
      rightPriceScale: {
        autoScale: true,
      },
      timeScale: {
        timeVisible: true,
        secondsVisible: true,
        tickMarkFormatter: (time, tickMarkType, locale) => {
          return moment(time * 1000).format('Do H:mm:ss');
        },
      },
      localization: {
        locale: 'zh-CN'
      },
    });
    const lineSeries = chartInstance.addLineSeries( {
      autoscaleInfoProvider: () => ({
        priceRange: {
          minValue: 119,
          maxValue: 120,
        },
      })
    });
    lineSeries.applyOptions({
      priceFormat: {
        type: "custom",
        formatter: price => "$" + price.toFixed(2),
      }
    });
    lineSeries.setData(data);
    chartInstance.timeScale().fitContent();
  };
  return <div id="price-charts">
  </div>
}
WrappedCharts.defaultProps = {
  customRef: {current: {}}
}