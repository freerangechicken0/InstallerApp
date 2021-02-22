import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthenticationService } from '../../core/_services/authentication.service';

@Component({
    selector: 'app-login',
    templateUrl: 'login.page.html',
    styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
    public readonly EMPTY_EMAIL_PASSWORD_MESSAGE = 'Please fill in both email and password';
    public readonly EMPTY_EMAIL_MESSAGE = 'Please fill in your email address';
    public readonly EMPTY_PASSWORD_MESSAGE = 'Please fill in your password';
    public readonly INVALID_EMAIL_MESSAGE = 'Invalid email address';

    loginForm: FormGroup;
    loading = false;
    submitted = false;
    returnUrl: string;
    error = '';
    showPassword = false;

    constructor(
        private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private authenticationService: AuthenticationService,
    ) {
    }

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required,
            Validators.pattern('^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}$'), Validators.maxLength(50)]],
            password: ['', Validators.required]
        });
        this.returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') || '/home';
    }

    // convenience getter for easy access to form fields
    get f() {
        return this.loginForm.controls;
    }

    onSubmit(event) {
        this.submitted = true;
        if (!this.f.email.value && event.srcElement[0]?.value) {
            this.f.email.setValue(event.srcElement[0]?.value);
        }
        if (!this.f.password.value && event.srcElement[1]?.value) {
            this.f.password.setValue(event.srcElement[1]?.value);
        }
        // stop here if form is invalid
        this.error = null;
        if (this.loginForm.invalid) {
            this.error = this.f.email.errors?.required
                ? this.f.password.errors?.required
                    ? this.EMPTY_EMAIL_PASSWORD_MESSAGE
                    : this.EMPTY_EMAIL_MESSAGE
                : this.f.password.errors?.required
                    ? this.EMPTY_PASSWORD_MESSAGE
                    : this.INVALID_EMAIL_MESSAGE;
            return;
        }

        this.loading = true;
        this.authenticationService.login(this.f.email.value, this.f.password.value)
            .subscribe((loginResponse) => {
                // terms guard will redirect to terms acceptance if needed
                // this.loading = false;
                // this.error = null;
                // this.router.navigateByUrl(this.returnUrl);
                this.error = null;
                this.loading = false;
                this.router.navigate(['/home']);
            }, error => {
                this.error = error.error.error;
                this.loading = false;
            });
    }
}
