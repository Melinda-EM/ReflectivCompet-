import { useRef, useLayoutEffect } from 'react';
import * as am5 from "@amcharts/amcharts5";
import * as am5xy from "@amcharts/amcharts5/xy";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";

const colorPalette = [
  0xe5c84a, 
  0xceced0, 
  0xd49260, 
  0x67b7dc, 
  0x6794dc, 
  0x8067dc,
  0xa367dc, 
  0xc767dc, 
  0xdc67ce, 
  0xdc6788, 
  0xdc6967, 
  0xfa9273, 
  0xdcd279, 
  0xc3dc67, 
  0xa0dc67, 
  0xd8ea93, 
  0xf7ef8c, 
  0xf3892d,
].map(am5.color);

const getColumnColor = (chart, series) => (_, target) => {
  const people = series._mainDataItems.map(item => item.dataContext)
  const ordered = people.toSorted((a, b) => b.value - a.value)
  const index = series.columns.indexOf(target)
  const who = people[index]
  const position = ordered.indexOf(who)
  const color = position < 3 ? position : index + 3
  return chart.get("colors").getIndex(color);
}

function Chart(props) {
  const chartRef = useRef(null);

  useLayoutEffect(() => {
    const root = am5.Root.new("chartdiv");

    root.setThemes([
      am5themes_Animated.new(root)
    ]);

    const chart = root.container.children.push(am5xy.XYChart.new(root, {
        panX: false,
        panY: false,
        wheelX: "none",
        wheelY: "none",
        paddingLeft: 0
      }));

    const cursor = chart.set("cursor", am5xy.XYCursor.new(root, {}));
    cursor.lineY.set("visible", false);

    const xRenderer = am5xy.AxisRendererX.new(root, { 
        minGridDistance: 30,
        minorGridEnabled: true,
    });

    const yRenderer = am5xy.AxisRendererY.new(root, {});
    const yAxis = chart.yAxes.push(am5xy.ValueAxis.new(root, {
        maxDeviation: 0,
        min: 0,
        extraMax: 0.2,
        renderer: yRenderer
    }));

    const xAxis = chart.xAxes.push(am5xy.CategoryAxis.new(root, {
        maxDeviation: 0,
        categoryField: "name",
        renderer: xRenderer,
        tooltip: am5.Tooltip.new(root, {})
    }));
    xAxis.data.setAll(props.data);
    xRenderer.grid.template.set("visible", false);
    
    chart.get("colors").set("colors", colorPalette);

    const series = chart.series.push(am5xy.ColumnSeries.new(root, {
        name: "Résultat",
        xAxis,
        yAxis,
        valueYField: "value",
        sequencedInterpolation: true,
        categoryXField: "name",
        tooltip: am5.Tooltip.new(root, { dy: -25, labelText: "{valueY}" }),
      }));
      
      series.columns.template.setAll({
        cornerRadiusTL: 5,
        cornerRadiusTR: 5,
        strokeOpacity: 0
      });

      series.columns.template.adapters.add("fill", getColumnColor(chart, series))
      series.columns.template.adapters.add("stroke", getColumnColor(chart, series));

      series.bullets.push((_, __, data) => {
          return am5.Bullet.new(root, {
            locationY: 1,
            sprite: am5.Picture.new(root, {
              templateField: "bulletSettings",
              width: 70,
              height: 100,
              centerX: am5.p50,
              centerY: am5.p100,
              shadowColor: am5.color(0x000000),
              shadowBlur: 4,
              shadowOffsetX: 4,
              shadowOffsetY: 4,
              shadowOpacity: 0.6,
              src: '/assets/' + data.dataContext.name + '.jpg'
            })
          });
        });
      
      xAxis.data.setAll(props.data);
      series.data.setAll(props.data);

    chart.set("cursor", am5xy.XYCursor.new(root, {}));

    chartRef.current = chart;

    return () => root.dispose();
  }, [props.data]);

  useLayoutEffect(() => {
      chartRef.current.set("paddingRight", props.paddingRight);
  }, [props.paddingRight]);

  return (
    <div id="chartdiv" style={{ width: "full", height: "700px", bottom: 0 }}></div>
  );
}
export default Chart;