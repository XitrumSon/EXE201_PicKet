export type BalanceDay={day:string;balance:number};
export function evaluateForecast(_predicted:BalanceDay[],_actual:BalanceDay[]){
  return {mae:0,missedNegativeDays:0,falseNegativeDays:0,minimumDayError:0};
}
