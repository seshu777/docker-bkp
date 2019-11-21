import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { ActivatedRouteSnapshot } from '@angular/router';
import { RouterStateSnapshot } from '@angular/router';
import { AuthGuard } from './auth.guard';
describe('AuthGuard', () => {
  let service: AuthGuard;
  beforeEach(() => {
    const routerStub = { navigate: array1 => ({}) };
    const activatedRouteSnapshotStub = {};
    const routerStateSnapshotStub = { url: {} };
    TestBed.configureTestingModule({
      providers: [
        AuthGuard,
        { provide: Router, useValue: routerStub },
        {
          provide: ActivatedRouteSnapshot,
          useValue: activatedRouteSnapshotStub
        },
        { provide: RouterStateSnapshot, useValue: routerStateSnapshotStub }
      ]
    });
    service = TestBed.get(AuthGuard);
  });
  it('can load instance', () => {
    expect(service).toBeTruthy();
  });
  describe('canActivate', () => {
    it('makes expected calls', () => {
      const activatedRouteSnapshotStub: ActivatedRouteSnapshot = TestBed.get(
        ActivatedRouteSnapshot
      );
      spyOn(service, 'verifyLogin').and.callThrough();
      service.canActivate();
      expect(service.verifyLogin).toHaveBeenCalled();
    });
  });
  describe('canActivate true', () => {
    it('makes expected calls', () => {
      const activatedRouteSnapshotStub: ActivatedRouteSnapshot = TestBed.get(
        ActivatedRouteSnapshot
      );
      spyOn(service, 'isLoggedIn').and.returnValue(true);
      spyOn(service, 'verifyLogin').and.callThrough();
      service.canActivate();
      let temp = service.verifyLogin();
      expect(temp).toBeTruthy();
      expect(service.verifyLogin).toHaveBeenCalled();
    });
  });
  describe('canActivate false', () => {
    it('makes expected calls', () => {
      const activatedRouteSnapshotStub: ActivatedRouteSnapshot = TestBed.get(
        ActivatedRouteSnapshot
      );
      spyOn(service, 'isLoggedIn').and.returnValue(false);
      spyOn(service, 'verifyLogin').and.callThrough();
      service.canActivate();
      let temp = service.verifyLogin();
      expect(temp).not.toBeTruthy();
      expect(service.verifyLogin).toHaveBeenCalled();
    });
  });
  describe('isLoggedIn true', () => {
    it('makes expected calls', () => {
      window.localStorage.setItem('is_loggedin', 'true');
      spyOn(service, 'isLoggedIn').and.callThrough();
      service.isLoggedIn();
      expect(service.isLoggedIn).toHaveBeenCalled();
    });
  });
  describe('isLoggedIn false', () => {
    it('makes expected calls', () => {
      window.localStorage.setItem('is_loggedin', 'false');
      spyOn(service, 'isLoggedIn').and.callThrough();
      service.isLoggedIn();
      expect(service.isLoggedIn).toHaveBeenCalled();
    });
  });
});
