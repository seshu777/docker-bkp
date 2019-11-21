import { Component } from '@angular/core';
import { ROUTES } from './side-nav-routes.config';
import { ThemeConstantService } from '../../services/theme-constant.service';

@Component({
    selector: 'app-sidenav',
    templateUrl: './side-nav.component.html'
})

export class SideNavComponent{

    public menuItems: any[]
    isFolded : boolean;
    isSideNavDark : boolean;

    constructor( private themeService: ThemeConstantService) {}

    ngOnInit(): void {
        let roles = window.localStorage.getItem('role');
         const userroles = roles.split(',');
         if (userroles.includes('SuperAdmin')) {
            this.menuItems = ROUTES.filter(menuItem => menuItem); 
         } else if (userroles.includes('Admin')) {
            this.menuItems = ROUTES.filter(menuItem => menuItem.title === 'Journals' ||  menuItem.title === 'Users' ||  menuItem.title === 'Articles') ;
         } else if (userroles.includes('Author')) {
            this.menuItems = ROUTES.filter(menuItem => menuItem.title === 'Articles') ;
         } else if (userroles.includes('Editor')) {
            this.menuItems = ROUTES.filter(menuItem => menuItem.title === 'Articles') ;
         } else if (userroles.includes('Reviewer')) {
            this.menuItems = ROUTES.filter(menuItem => menuItem.title === 'Articles') ;
         }
        
      //   this.menuItems = ROUTES.filter(menuItem => menuItem); 
        this.themeService.isMenuFoldedChanges.subscribe(isFolded => this.isFolded = isFolded);
        this.themeService.isSideNavDarkChanges.subscribe(isDark => this.isSideNavDark = isDark);
    }
}
