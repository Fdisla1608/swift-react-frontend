import React, { useState, useEffect, useRef } from "react";
import { Chart } from "primereact/chart";

const GaugeChart = (props) => {
  const chartRef = useRef(null);
  const [chartData, setChartData] = useState({});
  const [chartOptions, setChartOptions] = useState({});
  const [gaugeNeedle, setGaugeNeedle] = useState({});
  const [dataValue, setDataValue] = useState(props.data || 0);

  useEffect(() => {
    setDataValue(props.data || 0);
    const documentStyle = getComputedStyle(document.documentElement);
    const data = {
      labels: ["Muy Seco", "Seco", "Húmedo", "Inundado"],
      datasets: [
        {
          data: [25, 25, 25, 25],
          backgroundColor: [
            documentStyle.getPropertyValue("--red-500"),
            documentStyle.getPropertyValue("--yellow-500"),
            documentStyle.getPropertyValue("--green-500"),
            documentStyle.getPropertyValue("--blue-500"),
          ],
          hoverBackgroundColor: [
            documentStyle.getPropertyValue("--red-400"),
            documentStyle.getPropertyValue("--yellow-400"),
            documentStyle.getPropertyValue("--green-400"),
            documentStyle.getPropertyValue("--blue-400"),
          ],
          borderWidth: 0,
          needleValue: dataValue.toFixed(2),
          borderColor: "transparent",
        },
      ],
    };
    setChartData(data);

    setGaugeNeedle([
      {
        id: "needle",
        afterDatasetsDraw(chart) {
          const { ctx } = chart;

          ctx.save();
          const centerX = chart.getDatasetMeta(0).data[0].x;
          const centerY = chart.getDatasetMeta(0).data[0].y;
          const needleValue = dataValue;
          const outerRadius = chart.getDatasetMeta(0).data[0].outerRadius;
          const innerRadius = chart.getDatasetMeta(0).data[0].innerRadius;
          const radius = 15;

          ctx.translate(centerX, centerY);
          ctx.rotate(-(Math.PI / 2) + (needleValue * Math.PI) / 8);

          ctx.beginPath();
          ctx.strokeStyle = "grey";
          ctx.fillStyle = "grey";
          ctx.lineWidth = 1;

          ctx.moveTo(0 - radius, 0);
          ctx.lineTo(0, 0 - innerRadius - (outerRadius - innerRadius) / 2);
          ctx.lineTo(0 + radius, 0);
          ctx.stroke();
          ctx.fill();

          ctx.beginPath();
          ctx.arc(0, 0, radius, 0, Math.PI * 2, false);
          ctx.fill();
          ctx.restore();
        },
      },
      {
        id: "gaugeMeter",
        afterDatasetsDraw(chart) {
          const { ctx, data } = chart;

          ctx.save();
          const needleValue = data.datasets[0].needleValue;
          const centerX = chart.getDatasetMeta(0).data[0].x;
          const centerY = chart.getDatasetMeta(0).data[0].y;

          ctx.font = "bold 30px sans-serif";
          ctx.fillStyle = "grey";
          ctx.textAlign = "center";
          ctx.fillText(`${needleValue} H`, centerX, centerY + 45);
        },
      },
    ]);

    chartRef.current.refresh();
  }, [props.data]);

  useEffect(() => {
    const options = {
      animation: false,
      rotation: -90,
      circumference: 180,
      cutout: "60%",
      plugins: {
        legend: {
          display: false,
        },
      },
    };

    setChartOptions(options);

    // Limpieza para destruir el gráfico antes de desmontar o actualizar el componente
    return () => {
      if (chartRef.current && chartRef.current.chart) {
        chartRef.current.chart.destroy();
      }
    };
  }, []);

  return (
    <Chart
      ref={chartRef}
      type="doughnut"
      data={chartData}
      options={chartOptions}
      plugins={gaugeNeedle}
      style={chartStyle}
    />
  );
};

const chartStyle = {
  width: "100%",
  maxWidth: "400px",
  margin: "0 auto",
};

export default GaugeChart;
