import styled from 'styled-components';
import {Fragment, useEffect, useRef} from "react";
import {Chart, Interaction, registerables} from "chart.js";
import CrosshairPlugin, {Interpolate} from "../../utils/crosshair";
import Tooltip from "../Widgets/Tooltip";
import moment from "moment";
import numeral from 'numeral';
import Round8Dropdown from "../Widgets/Round8Dropdown";

Chart.register(...registerables);
Chart.register(CrosshairPlugin);
Interaction.modes.interpolate = Interpolate;

const Wrapper = styled.div`
  position: relative;
  padding: 65px 0 0 0 !important;
`;

const TooltipPriceText = styled.div`
  font-size: 22px;
  line-height: 28px;
  font-weight: 700;
  color: #11263C;
  padding: 4px;
  margin-top: 5px;
  border-bottom: 1px solid #E5E5E5;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const TooltipDateText = styled.div`
  font-size: 12px;
  line-height: 20px;
  color: rgba(60, 60, 67, 0.6);
`;

const PeriodDropdown = styled(Round8Dropdown)`
  width: 120px;
  position: absolute;
  left: 20px;
  top: 15px;
`;

const PriceChart = ({data}) => {
  const canvasRef = useRef(null);
  const tooltipRef = useRef(null);
  const chartRef = useRef(null);
  const tooltipPriceRef = useRef(null);
  const tooltipDateRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current || chartRef.current)
      return;

    const ctx = canvasRef.current.getContext("2d");
    const gradient = ctx.createLinearGradient(0, 0, 0, 250);

    gradient.addColorStop(0, 'rgba(111,134,255,0.17)');
    gradient.addColorStop(0.25, 'rgba(111,134,255,0.10)')
    gradient.addColorStop(0.75, 'rgba(111,134,255,0.03)');
    gradient.addColorStop(1, 'rgba(255,255,255,0)');

    const tooltipHandler = (context) => {
      if (!tooltipRef.current) {
        return;
      }

      const tooltipEl = tooltipRef.current;
      const {chart, tooltip} = context;

      if (!tooltipEl.style.display || tooltipEl.style.display === 'none') {
        tooltipEl.style.display = 'initial';
      }

      if (tooltip.opacity === 0) {
        tooltipEl.style.opacity = 0;
        tooltipEl.style.display = 'none';
      }

      const {title, body} = tooltip;
      const {offsetLeft: positionX, offsetTop: positionY} = chart.canvas;

      const price = title ? title[0] : 0;
      const date = body ? body[0].lines[0] : 0;

      tooltipPriceRef.current.innerText = price;
      tooltipDateRef.current.innerText = date;

      const rect = tooltipEl.getBoundingClientRect();

      tooltipEl.style.opacity = 1;
      tooltipEl.style.left = positionX + tooltip.caretX - (rect.width / 2 - 2) + 'px';
      tooltipEl.style.top = positionY + tooltip.caretY - (rect.height + 30) + 'px';
    };

    chartRef.current = new Chart(ctx, {
      type: 'scatter',
      data: {
        datasets: [{
          data: [],
          borderColor: '#0C33FF',
          borderWidth: 2,
          showLine: true,
          lineTension: 0,
          interpolate: true,
          backgroundColor: gradient,
          fill: 'start',
        }]
      },
      options: {
        maintainAspectRatio: false,
        scales: {
          x: {
            grid: {display: false, drawBorder: false},
            ticks: {display: false}
          },
          y: {
            beginAtZero: true,
            grid: {display: true, drawBorder: false},
            ticks: {display: false},
          }
        },
        elements: {
          point: {
            radius: 0,
            hitRadius: 0,
            hoverRadius: 0
          }
        },
        plugins: {
          legend: {display: false},
          tooltip: {
            enabled: false,
            animation: false,
            mode: "interpolate",
            intersect: true,
            external: tooltipHandler,
            callbacks: {
              title: (dataset) => numeral(dataset[0].element.y).format('0[.]00000000'),
              label: (dataset) => moment(dataset.element.x).format('LTS'),
            }
          },
          crosshair: {
            sync: {
              enabled: true,
            },
            line: {
              width: 1,
              color: 'rgba(66, 47, 138, 0.87)',
              dashPattern: [5, 5],
            },
            zoom: {
              enabled: false
            }
          }
        },
      }
    });

  }, []);

  useEffect(() => {
    if (!chartRef.current) {
      return;
    }

    if (Array.isArray(data) && data.length > 0) {
      let arr = data.map(o => ({
        x: new Date(o.updatedAt),
        y: o.priceUSD
      }));

      const first = arr[0];
      let last = arr[arr.length - 1];

      // 마지막에 현재시간과 마지막 가격으로 아이템 추가
      arr.push({
        x: new Date(),
        y: last.y
      })

      last = arr[arr.length - 1];

      chartRef.current.data.datasets[0].data = arr;
      chartRef.current.options.scales.x.min = first.x;
      chartRef.current.options.scales.x.max = last.x;
      chartRef.current.update();
    }
  }, [data]);

  return (
    <Fragment>
      <Wrapper>
        <canvas ref={canvasRef} height="250"/>
        {/*<PeriodDropdown/>*/}
        <Tooltip ref={tooltipRef}>
          <TooltipPriceText ref={tooltipPriceRef}/>
          <TooltipDateText ref={tooltipDateRef}/>
        </Tooltip>
      </Wrapper>
    </Fragment>
  )
};

export default PriceChart;
