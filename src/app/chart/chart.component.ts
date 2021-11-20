import { Component, ViewChild, OnInit, ViewEncapsulation } from '@angular/core'
import { SHOMockDataService } from '../services/sho-data.service.mock'

export const colors = [
  {
    backgroundColor: '#269CD4',
    borderColor: '#269CD4',
    pointBackgroundColor: '#fff',
    pointBorderColor: '#1FA5FF',
  },
  {
    backgroundColor: '#EB5064',
    borderColor: '#EB5064',
    pointBackgroundColor: '#fff',
    pointBorderColor: '#1FA5FF',
  },
  {
    backgroundColor: '#44F2D1',
    borderColor: '#44F2D1',
    pointBackgroundColor: '#fff',
    pointBorderColor: '#1FA5FF',
  },
  {
    backgroundColor: '#B7D639',
    borderColor: '#B7D639',
    pointBackgroundColor: '#fff',
    pointBorderColor: '#1FA5FF',
  },
  {
    backgroundColor: '#FDDA02',
    borderColor: '#FDDA02',
    pointBackgroundColor: '#fff',
    pointBorderColor: '#1FA5FF',
  },
  {
    backgroundColor: '#FFA173',
    borderColor: '#FFA173',
    pointBackgroundColor: '#fff',
    pointBorderColor: '#1FA5FF',
  },
  {
    backgroundColor: '#BA5FA4',
    borderColor: '#BA5FA4',
    pointBackgroundColor: '#fff',
    pointBorderColor: '#1FA5FF',
  },
  {
    backgroundColor: '#A286E6',
    borderColor: '#A286E6',
    pointBackgroundColor: '#fff',
    pointBorderColor: '#1FA5FF',
  },
  {
    backgroundColor: '#687FCF',
    borderColor: '#687FCF',
    pointBackgroundColor: '#fff',
    pointBorderColor: '#1FA5FF',
  },
  {
    backgroundColor: '#A8323E',
    borderColor: '#A8323E',
    pointBackgroundColor: '#fff',
    pointBorderColor: '#1FA5FF',
  },
  {
    backgroundColor: '#FC4903',
    borderColor: '#FC4903',
    pointBackgroundColor: '#fff',
    pointBorderColor: '#1FA5FF',
  },
  {
    backgroundColor: '#03FC1C',
    borderColor: '#03FC1C',
    pointBackgroundColor: '#fff',
    pointBorderColor: '#1FA5FF',
  },
  {
    backgroundColor: '#03BEFC',
    borderColor: '#03BEFC',
    pointBackgroundColor: '#fff',
    pointBorderColor: '#1FA5FF',
  },
  {
    backgroundColor: '#C603FC',
    borderColor: '#C603FC',
    pointBackgroundColor: '#fff',
    pointBorderColor: '#1FA5FF',
  },
  {
    backgroundColor: '#FC036B',
    borderColor: '#FC036B',
    pointBackgroundColor: '#fff',
    pointBorderColor: '#1FA5FF',
  },
  {
    backgroundColor: '#FCF803',
    borderColor: '#FCF803',
    pointBackgroundColor: '#fff',
    pointBorderColor: '#1FA5FF',
  },
]

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  shos: any[] = []
  participant: any = {}
  chart: any
  chartData: any
  wallet = '0x01ba8492f9d019bd6f7dddf1cd35fa022af6813b'
  @ViewChild('mylinechart')
  private chartComponent: any

  constructor(private shoDataService: SHOMockDataService) {
    this.chart = this.initChart()
    this.shos = shoDataService.getUserSHOs(this.wallet)
    this.participant = shoDataService.getParticipant(this.wallet)
    this.chart.dataSets = this.createDatasets()
  }

  initChart() {
    return {
      chartType: 'line',
      labels: this.initLabels(),
      dataSets: [],
      plugins: {
        tooltip: {
          enabled: false,
          intersect: false,
        },
      },
      options: {
        elements: {
          point: {
            radius: 0,
          },
          line: {
            tension: 0,
          },
        },
        tooltips: {
          enabled: false,
          custom: (tooltipModel: any) => {
            // Tooltip Element
            var tooltipEl = document.getElementById('chartjs-tooltip')

            // Create element on first render
            if (!tooltipEl) {
              tooltipEl = document.createElement('div')
              tooltipEl.id = 'chartjs-tooltip'
              tooltipEl.innerHTML = '<table></table>'
              document.body.appendChild(tooltipEl)
            }

            // Hide if no tooltip
            if (tooltipModel.opacity === 0) {
              tooltipEl.style.opacity = '0'
              return
            }

            // Set caret Position
            tooltipEl.classList.remove('above', 'below', 'no-transform')
            if (tooltipModel.yAlign) {
              tooltipEl.classList.add(tooltipModel.yAlign)
            } else {
              tooltipEl.classList.add('no-transform')
            }

            function getBody(bodyItem: any) {
              return bodyItem.lines
            }

            // Set Text
            if (tooltipModel.body) {
              var titleLines = tooltipModel.title || []
              var bodyLines = tooltipModel.body.map(getBody)

              var innerHtml = '<thead>'

              titleLines.forEach(function (title: any) {
                innerHtml += '<tr><th>' + title + '</th></tr>'
              })
              innerHtml += '</thead><tbody>'

              bodyLines.forEach(function (body: any, i: any) {
                var colors = tooltipModel.labelColors[i]
                var style = 'background:' + colors.backgroundColor
                style += '; border-color:' + colors.borderColor
                style += '; border-width: 2px'
                var img =
                  '<img width="20" height="20" style="background-color:pink; margin-right: 6px;" >'
                var span = '<span style="' + style + '"></span>'
                innerHtml += '<tr"><td>' + img + span + body + '</td></tr>'
              })
              innerHtml += '</tbody>'

              var tableRoot = tooltipEl.querySelector('table')
              if (tableRoot) {
                tableRoot.innerHTML = innerHtml
              }
            }

            // `this` will be the overall tooltip
            console.log(this.chartComponent);
            var position = this.chartComponent.nativeElement.getBoundingClientRect()

            // Display, position, and set styles for font
            tooltipEl.style.opacity = '1'
            tooltipEl.style.position = 'absolute'
            tooltipEl.style.left =
              position.left + window.pageXOffset + tooltipModel.caretX + 'px'
            tooltipEl.style.top =
              position.top + window.pageYOffset + tooltipModel.caretY + 'px'
            tooltipEl.style.fontFamily = tooltipModel._bodyFontFamily
            tooltipEl.style.fontSize = tooltipModel.bodyFontSize + 'px'
            tooltipEl.style.fontStyle = tooltipModel._bodyFontStyle
            tooltipEl.style.padding =
              tooltipModel.yPadding + 'px ' + tooltipModel.xPadding + 'px'
            tooltipEl.style.pointerEvents = 'none'
            tooltipEl.style.backgroundColor = 'rgba(0,0,0,0.8)'
            tooltipEl.style.color = 'rgb(255,255,255)'
          },
        },

        responsive: true,
        maintainAspectRatio: false,
        bezierCurve: false,
        legend: {
          display: true,
          position: 'bottom',
        },
        scales: {
          xAxes: [
            {
              display: true,
              stacked: true,
            },
          ],
          yAxes: [
            {
              display: true,
              stacked: true,
              ticks: {
                beginAtZero: true,
              },
              scaleLabel: {
                display: true,
                labelString: 'Number of Reads',
              },
            },
          ],
        },
      },
      colors,
    }
  }

  initLabels() {
    return ['0d', '30d', '60d', '90d', '120d', '150d', '180d', '210d', '240d']
  }

  createDatasets() {
    if (!this.shos || !this.participant) {
      return []
    }
    const datasets: any = []
    this.shos.forEach((sho) => {
      datasets.push(this.createShoDataset(sho, this.participant))
    })

    return datasets
  }

  createShoDataset(sho: any, participant: any) {
    const amount = this.shoDataService.getShoVestingAmount(sho, participant)
    const period = this.shoDataService.getShoVestingPeriod(sho)

    this.chart.labels = period
    const label = sho.is_listed ? sho.name : sho.name + ' (unlisted)'
    return {
      data: amount,
      label,
      period,
    }
  }
  ngOnInit(): void {}
}
