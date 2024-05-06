import { actorCategory } from "../consts/actorCategories"
import { districtCodes } from "../consts/districtCodes"



export const generateUniqueNumber = (district: string, category: string) => {

  let addressCode = districtCodes[district]

  let timestamp = JSON.stringify(Date.now()).substr(-5, 5)
  let random = JSON.stringify(Math.floor(Math.random() * 900000000 + 100000000))
  let uniqueNumber = `${timestamp}${random}`.substr(0, 6) // combine the timestamp and random number and take the first 9 digits
  let categoryNumber

  if (category === actorCategory.single) {
    categoryNumber = "1"
  } else if (category === actorCategory.organization) {
    categoryNumber = "2"
  } else if (category === actorCategory.company) {
    categoryNumber = "3"
  } else {
    categoryNumber = "7"
  }

  let identifier = `${categoryNumber}${addressCode}${uniqueNumber}`

  while (identifier.length !== 9) {
    random = JSON.stringify(Math.floor(Math.random() * 1000000)) // generate a random number between 0 and 999999
    timestamp = JSON.stringify(Date.now()).substr(-5, 5)
    uniqueNumber = `${timestamp}${random}`.substr(0, 6)
    identifier = `${categoryNumber}${addressCode}${uniqueNumber}`
  }


  return identifier
}


