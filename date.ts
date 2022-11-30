const date='11/11/2022'
if (!date) console.log( 'no date');
  //date: 17/08/2022
  const dateTimestamp=new Date(Date.parse(date.split('/').reverse().join('-'))) // 11-11-2022 00:00:00.000
  const today = new Date()  // 11-11-2022 07:40:00.000
  console.log(today)
  today.setHours(today.getHours()+3) // 11-11-2022 10:40:00.000
  const dayAfter= new Date(dateTimestamp) // 11-11-2022 00:00:00.000
  dayAfter.setDate(dayAfter.getDate()+3)
  console.log(dateTimestamp)
  console.log(today)
  console.log(dayAfter)
  console.log( dateTimestamp<today && today<dayAfter)