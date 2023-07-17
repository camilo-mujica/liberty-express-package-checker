import * as puppeteer from 'puppeteer'
import * as dotenv from 'dotenv'
import { sendEmail } from './mailService'

// Load environment variables
dotenv.config()

const packages = process.env.PACKAGES?.split(',') || [] // packages to check
const baseUrl = 'https://liberty-online.iplus.com.do/lg-es/ut/Estatus.aspx?id=' // base url to check packages

// Check if there are packages to check, if not, exit
if (packages.length === 0) {
  console.log('No packages to check')
  process.exit(0)
}

// Object to store the current status of the packages
let currentPackagesStatuses: Record<string, string> = {}

// Function to check the status of the packages
const checktStatuses = async () => {
  const browser = await puppeteer.launch()
  const newPackagesStatuses: Record<string, string> = {}

  const checkLastStatus = async (packageId: string) => {
    const page = await browser.newPage()
    const url = baseUrl + packageId
    await page.goto(url)
    const tdElement = await page.waitForSelector(
      '#cphCuerpo_gvEstatus_tccell0_0',
    )
    const lastStatus = await page.evaluate(
      (td) => td.firstElementChild.innerText,
      tdElement,
    )
    newPackagesStatuses[packageId] = lastStatus
  }

  for (const element of packages) {
    await checkLastStatus(element)
  }

  if (
    JSON.stringify(currentPackagesStatuses) !==
    JSON.stringify(newPackagesStatuses)
  ) {
    currentPackagesStatuses = { ...newPackagesStatuses }
    const emailContent = Object.entries(newPackagesStatuses)
      .map(([key, value]) => `- Package ${key} status: ${value}`)
      .join('<br/>')
    sendEmail(emailContent)
  } else {
    console.log('Status not changed')
  }
  await browser.close()
}

// Check the status of the packages when the app starts
checktStatuses()

// Check the status of the packages every X minutes
const timer = process.env.TIMER ? parseInt(process.env.TIMER) : 5 * 60 * 1000
setInterval(() => {
  checktStatuses()
}, timer)
