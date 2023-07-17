import * as puppeteer from 'puppeteer'
import * as dotenv from 'dotenv'
import { sendEmail } from './mailService'

// Load environment variables
dotenv.config()

const packages = process.env.PACKAGES?.split(',') || [] // packages tracking numbers to check

// Check if there are packages to check, if not, exit
if (packages.length === 0) {
  console.log('No packages to check')
  process.exit(0)
}

// Function to get the last status of a package
const getPackageLastStatus = async (
  trackingNumber: string,
  browser: puppeteer.Browser,
): Promise<string> => {
  const page = await browser.newPage()
  const url = `https://liberty-online.iplus.com.do/lg-es/ut/Estatus.aspx?id=${trackingNumber}`
  const selector = '#cphCuerpo_gvEstatus_tccell0_0'
  await page.goto(url)
  const tdElement = await page.waitForSelector(selector)
  const lastStatus = await page.evaluate(
    (td) => td.firstElementChild.innerText,
    tdElement,
  )
  return lastStatus
}

type PackageStatusesObj = Record<string, string>

// Object to store the current status of the packages
let currentPackagesStatuses: PackageStatusesObj = {}

// Function to check the status of the packages
const checktStatuses = async () => {
  const browser = await puppeteer.launch({ headless: true })
  // Object to store the new status of the packages
  const newPackagesStatuses: PackageStatusesObj = {}

  for (const element of packages) {
    const status = await getPackageLastStatus(element, browser)
    newPackagesStatuses[element] = status
  }

  // Check if the status of the packages has changed
  const hasChanged =
    JSON.stringify(currentPackagesStatuses) !==
    JSON.stringify(newPackagesStatuses)

  if (hasChanged) {
    currentPackagesStatuses = { ...newPackagesStatuses }
    const emailContent = Object.entries(newPackagesStatuses)
      .map(([key, value]) => `- Package ${key} status: ${value}`)
      .join('<br/>')
    console.log('Status changed')
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
