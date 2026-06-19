export default class LoginPage {
  
  constructor(page) {
    this.page = page;
    this.homeloginBtn = page.getByRole('link', { name: 'login login' });
    this.email = page.getByRole('textbox', { name: 'Email address' });
    this.password = page.getByRole('textbox', { name: 'Password' });
    this.loginBtn = page.getByRole('button', { name: 'Login' });
    this.locationAccess = page.locator('div').filter({ hasText: /^Allow Giottus to access your location$/ });
    this.otpBox = page.getByRole('textbox', { name: 'Enter code here' });
  }

  async openWebsite() {
    await this.page.goto('https://stage3.giottus.com/')
    
  }

  async clickLogin() {   
        await this.homeloginBtn.click();
  }

  async login(email, password) {
    await this.email.fill(email);
    await this.password.fill(password);
    await this.loginBtn.click();
    await this.locationAccess.click();
  }

  async enterOtp(otp) {
    await this.otpBox.fill(otp);
    
  }

}

