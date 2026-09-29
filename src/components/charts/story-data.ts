/** Shared demo data for the Charts group stories — CRM-flavored but
 *  generically named, matching the Long Pepper prototype vocabulary. */

export const MONTHLY = [
  { month: "Jan", won: 12, lost: 4, open: 9 },
  { month: "Feb", won: 15, lost: 5, open: 11 },
  { month: "Mar", won: 11, lost: 6, open: 8 },
  { month: "Apr", won: 18, lost: 3, open: 14 },
  { month: "May", won: 21, lost: 6, open: 12 },
  { month: "Jun", won: 17, lost: 4, open: 15 },
  { month: "Jul", won: 23, lost: 7, open: 13 },
  { month: "Aug", won: 26, lost: 5, open: 16 },
  { month: "Sep", won: 22, lost: 6, open: 18 },
  { month: "Oct", won: 28, lost: 4, open: 15 },
  { month: "Nov", won: 31, lost: 7, open: 17 },
  { month: "Dec", won: 27, lost: 5, open: 19 },
]

/** Thai months (abbreviated) with translated series keys. */
export const MONTHLY_TH = MONTHLY.map((row, i) => ({
  month: ["ม.ค.", "ก.พ.", "มี.ค.", "เม.ย.", "พ.ค.", "มิ.ย.", "ก.ค.", "ส.ค.", "ก.ย.", "ต.ค.", "พ.ย.", "ธ.ค."][i],
  won: row.won,
  lost: row.lost,
  open: row.open,
}))

export const STAGES = [
  { stage: "Qualified", count: 42 },
  { stage: "Contact made", count: 31 },
  { stage: "Demo scheduled", count: 18 },
  { stage: "Proposal made", count: 12 },
  { stage: "Negotiations", count: 7 },
]

export const STAGES_TH = [
  { stage: "คุณสมบัติครบ", count: 42 },
  { stage: "ติดต่อแล้ว", count: 31 },
  { stage: "นัดสาธิต", count: 18 },
  { stage: "ส่งข้อเสนอ", count: 12 },
  { stage: "เจรจา", count: 7 },
]

/** Won split for the donut. */
export const WON_BY_SOURCE = [
  { key: "inbound", label: "Inbound", value: 38 },
  { key: "outbound", label: "Outbound", value: 24 },
  { key: "referral", label: "Referral", value: 18 },
  { key: "partner", label: "Partner", value: 9 },
]

export const WON_BY_SOURCE_TH = [
  { key: "inbound", label: "ลูกค้าเข้าเอง", value: 38 },
  { key: "outbound", label: "ทีมขายออก", value: 24 },
  { key: "referral", label: "แนะนำ", value: 18 },
  { key: "partner", label: "พันธมิตร", value: 9 },
]

/** Actual (11 points) + forecast tail for the dashed line story. */
export const REVENUE = [
  { month: "Nov", actual: 41, forecast: 41 },
  { month: "Dec", actual: 44, forecast: 44 },
  { month: "Jan", actual: 42, forecast: 42 },
  { month: "Feb", actual: 48, forecast: 48 },
  { month: "Mar", actual: 46, forecast: 46 },
  { month: "Apr", actual: 52, forecast: 52 },
  { month: "May", actual: 57, forecast: 57 },
  { month: "Jun", actual: 61, forecast: 61 },
  { month: "Jul", actual: null, forecast: 63 },
  { month: "Aug", actual: null, forecast: 66 },
  { month: "Sep", actual: null, forecast: 71 },
]

export const SPARK = [8, 12, 10, 15, 13, 17, 16, 21, 19, 24, 22, 28]
