import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SHOMockDataService } from '../services/sho-data.service.mock';


export const formatNumWithComma = (num: string | number | any[]) => {
	if (Number(num)) {
		// console.log('num format ', num);
		num = num.toString();
		const formattedNum = parseFloat(`${num}`.replace(/\,/g, ''));
		if (num[num.length - 1] !== '.') {
			return formattedNum.toLocaleString('en') as any;
		}
	}
	return num;
};

const TOP_ADDITIONAL_PART = 15;
const LEFT_ADDITIONAL_PART = 15;
const DAYS_IN_YEAR = 365;
const ONE_P_HEIGHT = 11;
const DEFAULT_TOOLTIP_HEIGHT = 40;
const LEFT_TOOLTIP_ROTATE = 225;
const RIGHT_TOOLTIP_ROTATE = 45;

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
];

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./chart.component.scss'],
})
export class ChartComponent implements OnInit {
  shos: any[] = [];
  participant: any = {};
  wallet = '0x02c22dad3e10b51a8c23bb7160c5179545280733';
  chart: any;
	chartData: any;
	scrollY = 0;
	percent = 0;
	position = 0;
	maxValueFromLastDay = 0;
	dataSets: any;
	tooltipLeft = 0;
	dayNumber = 0;
	colors: any = [];

  constructor(private shoDataService: SHOMockDataService) {
    this.shos = shoDataService.getUserSHOs(this.wallet);
    this.participant = shoDataService.getParticipant(this.wallet);
    this.chart = this.initChart();
		this.init();
  }
	ngOnChanges(_: any) {
		this.colors = colors;
		this.init();
	}

	getShoName(sho: { name: string; }) {
		const name = sho?.name
			.split(' ')
			.map((e) => e[0].toUpperCase() + e.slice(1))
			.join(' ')
			.replace(/ /g, '')
			.replace('(unlisted)', '');
		return name;
	}
	getValueOfVestedTokens(sho: any) {
		const valueVested =
			sho?.locked *
			sho?.tokens_per_allo *
			sho?.price_current *
			this.participant.sho[this.getShoName(sho)]?.allocations;
		return valueVested;
	}

	init() {
		this.chart.dataSets = this.createDatasets();
		const maxVesting = this.calculateMaxVesting(this.chart.dataSets);
		this.maxValueFromLastDay = this.calculateMaxValueOfYAxes(maxVesting);
		this.chart.options.scales.yAxes[0].ticks.max = this.maxValueFromLastDay;
	}

	calculateMaxVesting(datasets: any) {
		if (!datasets) {
			return 0;
		}

		let maxVesting = 0;
		for (const dataset of datasets) {
			if (dataset.data.length) {
				maxVesting += dataset.data[dataset.data.length - 1];
			}
		}

		return maxVesting;
	}

	calculateMaxValueOfYAxes(maxVesting: number) {
		if (maxVesting <= 0) {
			return 1;
		}
		let num = 1;

		// eslint-disable-next-line prefer-for-of
		for (let i = 0; i < parseInt(maxVesting.toString()).toString().length - 1; i++) {
			num *= 10;
		}

		return num + parseInt(maxVesting.toString()) - ((num + parseInt(maxVesting.toString())) % num);
	}

	dateToShortFormat(date: Date) {
		const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

		const day = date.getDate();

		const monthIndex = date.getMonth();
		const monthName = monthNames[monthIndex];

		const year = date.getFullYear();

		return `${day} ${monthName} ${year}`;
	}

	addDays(daysCount: number): string {
		const date = new Date();
		date.setDate(date.getDate() + daysCount);
		return this.dateToShortFormat(date);
	}

	initChart() {
		return {
			chartType: 'line',
			labels: this.initLabels(),
			dataSets: [],
			plugins: {
				tooltip: {
					enabled: false,
				},
			},
			options: {
				hover: {
					enabled: true,
					mode: 'nearest',
					intersect: true,
					onHover: (event: any) => {
						const chartHeight = event.target.clientHeight - 50;
						let chartWidth = event.target.clientWidth;
						this.tooltipLeft = event.offsetX;
						const marginLeft = 70;
						const marginRight = 10;
						chartWidth = chartWidth - marginLeft - marginRight;
						const oanDay = chartWidth / DAYS_IN_YEAR;
						this.dayNumber = Math.floor((this.tooltipLeft - marginLeft) / oanDay);
						const description = [];
						const data = this.chart.dataSets;
						let totalPrice = 0;
						if (this.dayNumber) {
							this.scrollY = 0;
							this.percent = 0;
							for (const dataset of data) {
								if (dataset.hidden) {
									continue;
								}
								if (dataset.data.length) {
									this.position = this.dayNumber;
									totalPrice += parseInt(dataset.data[this.position]);
									description.push(
										dataset.label +
											': $' +
											formatNumWithComma(parseInt(dataset.data[this.position]))
									);
									this.scrollY += dataset.data[this.position];
								}
							}
						}

						this.percent = ((this.maxValueFromLastDay - this.scrollY) / this.maxValueFromLastDay) * 100;
						let tooltipEl = document.getElementById('chartjs-tooltip');

						if (!tooltipEl) {
							tooltipEl = document.createElement('div');
							tooltipEl.id = 'chartjs-tooltip';
							tooltipEl.innerHTML = '<div class="tolltipeTable"></div>';
							document.getElementsByClassName('chart-wrapper-canvas')[0].appendChild(tooltipEl);
						}

						const posit = this.position > DAYS_IN_YEAR / 2 ? 'right' : 'left';
						const rotate = this.position > DAYS_IN_YEAR / 2 ? RIGHT_TOOLTIP_ROTATE : LEFT_TOOLTIP_ROTATE;
						const pointerDisplay = this.dayNumber <= 0 || this.dayNumber > DAYS_IN_YEAR ? 'none' : 'block';
						let innerHtml = '<div class="chart-pointer" style="display:' + pointerDisplay + '">';

						innerHtml +=
							'<div class="chart-pointer-arrow" style="' +
							posit +
							': 26px; transform: rotate(' +
							rotate +
							'deg);"></div>';
						innerHtml +=
							'<div class="chart-pointer-text" style="' +
							posit +
							': 34px; top: -' +
							(description.length * ONE_P_HEIGHT + DEFAULT_TOOLTIP_HEIGHT) +
							'px">';

						innerHtml += '<span class="chart-text-title">' + this.addDays(this.position) + '</span>';
						innerHtml +=
							'<span class="chart-total-vested">' +
							'Total Vested : $' +
							formatNumWithComma(totalPrice) +
							'</span><hr>';
						description.forEach((body: any) => {
							innerHtml += '<p class="chart-percent-value" >' + body + '</p>';
						});

						innerHtml += '</div>' + '</div>';

						const tableRoot = tooltipEl.querySelector('.tolltipeTable');
						if (tableRoot) {
							tableRoot.innerHTML = innerHtml;
						}

						const laspercent = (chartHeight * this.percent) / 100 - TOP_ADDITIONAL_PART + 'px';

						tooltipEl.style.opacity = '1';
						tooltipEl.style.position = 'absolute';
						tooltipEl.style.left = this.tooltipLeft - LEFT_ADDITIONAL_PART + 'px';
						tooltipEl.style.top = laspercent;
					},
				},
				elements: {
					point: {
						radius: 0,
					},
					line: {
						tension: 0,
					},
				},
				responsive: true,
				maintainAspectRatio: false,
				bezierCurve: false,
				legend: {
					display: false,
					position: 'bottom',
				},
				scales: {
					xAxes: [
						{
							display: true,
							stacked: true,
							ticks: {
								beginAtZero: true,
								autoSkipPadding: 45, // MAGIC
								autoSkip: true,
								maxRotation: 0,
								callback(value: string) {
									return value + 'd';
								},
							},
							scaleLabel: {
								display: true,
								labelString: 'Days',
							},
						},
					],
					yAxes: [
						{
							display: true,
							stacked: true,
							ticks: {
								beginAtZero: true,
								callback(value: any) {
									return '$' + formatNumWithComma(Number(value));
								},
							},
							scaleLabel: {
								display: true,
								labelString: 'Estimated total USD value with current prices',
							},
						},
					],
				},
			},
			colors,
		};
	}

	initLabels() {
		return ['0d', '30d', '60d', '90d', '120d', '150d', '180d', '210d', '240d'];
	}

	createDatasets() {
		if (!this.shos || !this.participant) {
			return [];
		}
		const datasets: { data: number[]; label: any; period: any; }[] = [];
		this.shos.forEach((sho) => {
			if (sho.locked && this.participant.sho[this.getShoName(sho)].allocations) {
				datasets.push(this.createShoDataset(sho, this.participant));
			}
		});

		return datasets;
	}

	createShoDataset(sho: { is_listed: any; name: string; }, participant: any) {
		const amount = this.shoDataService.getShoVestingAmount(sho, participant);
		const period = this.shoDataService.getShoVestingPeriod(sho);

		this.chart.labels = period;
		const label = sho.is_listed ? sho.name : sho.name + ' (unlisted)';
		return {
			data: amount,
			label,
			period,
		};
	}

	ngOnInit(): void {
		const shosData: any[] = [];
		this.shos?.forEach((sho) => {
			if (sho.locked && this.participant.sho[this.getShoName(sho)].allocations) {
				shosData.push(sho);
			}
		});
		this.shos = shosData;
	}
}
