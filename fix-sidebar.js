const fs = require('fs');

const path = 'components/layout/admin-sidebar.jsx';
let content = fs.readFileSync(path, 'utf8');

// The file is messed up because it has:
/*
                if (isCollapsed) {
                            {item.badge && <span className="flex items-center justify-center h-5 min-w-[20px] px-1.5 text-xs font-bold rounded-full bg-primary text-primary-foreground">
                                {item.badge}
                              </span>}
                          </TooltipContent>
                        </Tooltip>;
                }
*/

// Let's rewrite the `group.items.map` block entirely to fix it.
content = content.replace(/\{group\.items\.map\(item => \{[\s\S]*?return <div key=\{item\.href\}>\{linkContent\}<\/div>;\s*\}\)\}/, 
`{group.items.map(item => {
                const isActive = item.exact 
                  ? pathname === item.href 
                  : (item.href === '/admin' ? pathname === '/admin' : pathname === item.href || pathname.startsWith(item.href + '/'));
                  
                const Icon = item.icon;
                const linkContent = <Link to={item.href} className={cn('flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors', isActive ? 'bg-sidebar-primary text-sidebar-primary-foreground' : 'text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground', isCollapsed && 'justify-center px-2')}>
                        <Icon className={cn('shrink-0', isCollapsed ? 'w-5 h-5' : 'w-5 h-5')} />
                        {!isCollapsed && <>
                            <span className="flex-1">{item.label}</span>
                            {item.badge && <span className="flex items-center justify-center h-5 min-w-[20px] px-1.5 text-xs font-bold rounded-full bg-primary text-primary-foreground">
                                {item.badge}
                              </span>}
                          </>}
                      </Link>;
                if (isCollapsed) {
                  return <Tooltip key={item.href}>
                          <TooltipTrigger asChild>{linkContent}</TooltipTrigger>
                          <TooltipContent side="right" className="flex items-center gap-2">
                            {item.label}
                            {item.badge && <span className="flex items-center justify-center h-5 min-w-[20px] px-1.5 text-xs font-bold rounded-full bg-primary text-primary-foreground">
                                {item.badge}
                              </span>}
                          </TooltipContent>
                        </Tooltip>;
                }
                return <div key={item.href}>{linkContent}</div>;
              })}`);

fs.writeFileSync(path, content, 'utf8');
console.log('Fixed admin sidebar');
