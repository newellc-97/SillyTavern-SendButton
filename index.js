import { delay } from '../../../utils.js';
import { waitForFrame } from './src/lib/wait.js';
import { Settings } from './src/Settings.js';

export const settings = new Settings();
settings.render();

const originalBtn = /**@type {HTMLElement}*/(document.querySelector('#send_but'));
originalBtn.addEventListener('contextmenu', (evt)=>{
    evt.preventDefault();
    evt.stopPropagation();
    evt.stopImmediatePropagation();
    showMenu();
});

export const updateBtn = ()=>{
    const btn = settings.button ? settings.button.render() : originalBtn;
    btn.classList.remove('displayNone');
    document.querySelector('#send_but').replaceWith(btn);
};
updateBtn();

/**@type {HTMLElement} */
let menu;
const hideMenu = async()=>{
    menu.classList.remove('stsb--active');
    await delay(210);
    menu.remove();
    menu = null;
};
export const showMenu = async()=>{
    if (menu) {
        hideMenu();
        return;
    }
    menu = document.createElement('div'); {
        menu.classList.add('stsb--menu');
        menu.addEventListener('pointerdown', (evt)=>{
            evt.preventDefault();
            evt.stopPropagation();
            evt.stopImmediatePropagation();
        });
        menu.addEventListener('click', (evt)=>{
            evt.preventDefault();
            evt.stopPropagation();
            evt.stopImmediatePropagation();
        });
        menu.addEventListener('pointerup', (evt)=>{
            evt.preventDefault();
            evt.stopPropagation();
            evt.stopImmediatePropagation();
        });
        if (settings.buttonId !== null) {
            const item = document.createElement('div'); {
                item.classList.add('stsb--item');
                item.addEventListener('pointerdown', (evt)=>{
                    evt.preventDefault();
                    evt.stopPropagation();
                    evt.stopImmediatePropagation();
                });
                const lbl = document.createElement('div'); {
                    lbl.classList.add('stsb--label');
                    lbl.textContent = originalBtn.title;
                    lbl.title = 'Switch to default send button';
                    lbl.addEventListener('click', async(evt)=>{
                        evt.preventDefault();
                        evt.stopPropagation();
                        evt.stopImmediatePropagation();
                        await hideMenu();
                        settings.buttonId = null;
                        updateBtn();
                    });
                    item.append(lbl);
                }
                const btn = /**@type {HTMLElement}*/(originalBtn.cloneNode(true)); {
                    btn.id = '';
                    btn.classList.remove('displayNone');
                    btn.classList.add('stsb--icon');
                    btn.title = `Send / Execute\n---\n${btn.title}`;
                    btn.addEventListener('click', async(evt)=>{
                        evt.preventDefault();
                        evt.stopPropagation();
                        evt.stopImmediatePropagation();
                        await hideMenu();
                        originalBtn.click();
                    });
                    item.append(btn);
                }
                menu.append(item);
            }
        }
        for (const sb of settings.buttonList) {
            if (sb == settings.button) continue;
            const item = document.createElement('div'); {
                item.classList.add('stsb--item');
                item.addEventListener('pointerdown', (evt)=>{
                    evt.preventDefault();
                    evt.stopPropagation();
                    evt.stopImmediatePropagation();
                });
                item.addEventListener('click', (evt)=>{
                    evt.preventDefault();
                    evt.stopPropagation();
                    evt.stopImmediatePropagation();
                });
                item.addEventListener('pointerup', (evt)=>{
                    evt.preventDefault();
                    evt.stopPropagation();
                    evt.stopImmediatePropagation();
                });
                const lbl = document.createElement('div'); {
                    lbl.classList.add('stsb--label');
                    lbl.textContent = sb.title;
                    lbl.title = `Switch to [${sb.title}]\n---\n${sb.command}`;
                    lbl.addEventListener('click', async(evt)=>{
                        evt.preventDefault();
                        evt.stopPropagation();
                        evt.stopImmediatePropagation();
                        await hideMenu();
                        settings.buttonId = sb.id;
                        updateBtn();
                    });
                    item.append(lbl);
                }
                const btn = sb.buildDom(); {
                    btn.id = '';
                    btn.classList.add('stsb--icon');
                    btn.title = `Send / Execute\n---\n${btn.title}`;
                    btn.addEventListener('click', async(evt)=>{
                        evt.preventDefault();
                        evt.stopPropagation();
                        evt.stopImmediatePropagation();
                        await hideMenu();
                        sb.execute();
                    });
                    item.append(btn);
                }
                menu.append(item);
            }
        }
        if (settings.button) settings.button.dom.root.append(menu);
        else originalBtn.append(menu);
        await waitForFrame();
        menu.classList.add('stsb--active');
    }
};

document.querySelector('#send_textarea').addEventListener('keydown', (/**@type {KeyboardEvent}*/evt)=>{
    if (evt.key == 'Enter' && !evt.ctrlKey && !evt.altKey && !evt.shiftKey && settings.button) {
        evt.preventDefault();
        evt.stopPropagation();
        evt.stopImmediatePropagation();
        settings.button.execute();
    }
});
