import { saveSettingsDebounced } from '../../../../../script.js';
import { extension_settings } from '../../../../extensions.js';
import { debounce, getSortableDelay, showFontAwesomePicker } from '../../../../utils.js';
import { SendButton } from './SendButton.js';


export class Settings {
    /**@type {SendButton[]} */ buttonList = [
        SendButton.from({
            id: '1',
            command: '/echo test',
            icon: 'fa-paper-plane',
            color: 'red',
            badge: 'fa-paper-plane',
            title: 'custom send',
        }),
        // SendButton.from({
        //     id: '2',
        //     command: '/echo {{input}}',
        //     icon: 'fa-paper-plane',
        //     color: 'blue',
        //     badge: '#2',
        //     title: 'custom send #2',
        // }),
    ];
    /**@type {string} */ buttonId = '1';

    get button() {
        return this.buttonList.find(it=>it.id == this.buttonId);
    }




    constructor() {
        Object.assign(this, extension_settings.sendButton ?? {});
        this.buttonList = this.buttonList?.map(it=>SendButton.from(it)) ?? [];
        extension_settings.sendButton = this;
    }

    save() {
        saveSettingsDebounced();
    }

    render() {
        const html = `
            <div id="stsb--settings">
                <div class="inline-drawer">
                    <div class="inline-drawer-toggle inline-drawer-header">
                        <b>Send Button</b>
                        <div class="inline-drawer-icon fa-solid fa-circle-chevron-down down"></div>
                    </div>
                    <div class="inline-drawer-content" style="font-size:small;">
                        <div class="flex-container">
                            <div class="stsb--btnContainer">
                                <ul class="stsb--btnList"></ul>
                                <div class="stsb--btnActions">
                                    <div class="stsb--btnAdd menu_button menu_button_icon fa-solid fa-plus"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        const settingsTpl = document
            .createRange()
            .createContextualFragment(html)
            .querySelector('#stsb--settings')
        ;
        const dom = /**@type {HTMLElement} */(settingsTpl.cloneNode(true));
        this.dom = dom;
        document.querySelector('#extensions_settings').append(dom);
        /**@type {HTMLElement} */
        const bgAdd = dom.querySelector('.stsb--btnAdd');
        bgAdd.addEventListener('click', ()=>{
            const item = new SendButton();
            this.buttonList.push(item);
            const li = this.makeBgItem(item);
            li.item = item;
            buttonList.append(li);
        });
        const buttonList = dom.querySelector('.stsb--btnList'); {
            this.buttonList.forEach(item=>{
                const li = this.makeBgItem(item);
                li.item = item;
                buttonList.append(li);
            });
        }
        // $(buttonList).sortable({
        //     delay: getSortableDelay(),
        //     stop: ()=>{
        //         this.buttonList.sort((a,b)=>[...buttonList.children].findIndex(it=>it.item == a) - [...buttonList.children].findIndex(it=>it.item == b));
        //         saveSettingsDebounced();
        //     },
        // });
    }

    /**
     *
     * @param {SendButton} item
     * @returns
     */
    makeBgItem(item) {
        /**@type {HTMLElement} */
        let btn;
        const updatePreview = ()=>{
            const newBtn = item.buildDom(); {
                newBtn.id = '';
                newBtn.classList.add('stsb--icon');
                btn.replaceWith(newBtn);
                btn = newBtn;
            }
            item.render();
            this.save();
        };
        const updatePreviewDebounced = debounce(updatePreview);
        const li = document.createElement('li'); {
            li.classList.add('stsb--item');
            btn = item.buildDom(); {
                btn.id = '';
                btn.classList.add('stsb--icon');
                li.append(btn);
            }
            const cont = document.createElement('div'); {
                cont.classList.add('stsb--content');
                const wrap = document.createElement('div'); {
                    wrap.classList.add('stsb--wrap');
                    // icon
                    const icon = document.createElement('div'); {
                        icon.classList.add('stsb--setting');
                        const lbl = document.createElement('div'); {
                            lbl.classList.add('stsb--label');
                            lbl.textContent = 'Icon';
                            icon.append(lbl);
                        }
                        const inp = document.createElement('div'); {
                            inp.classList.add('menu_button');
                            inp.classList.add('fa-solid', 'fa-fw', item.icon);
                            inp.addEventListener('click', async()=>{
                                const newIcon = await showFontAwesomePicker();
                                if (newIcon) {
                                    inp.classList.remove(item.icon);
                                    inp.classList.add(newIcon);
                                    item.icon = newIcon;
                                    updatePreviewDebounced();
                                }
                            });
                            icon.append(inp);
                        }
                        wrap.append(icon);
                    }
                    // color
                    const color = document.createElement('div'); {
                        color.classList.add('stsb--setting');
                        const lbl = document.createElement('div'); {
                            lbl.classList.add('stsb--label');
                            lbl.textContent = 'Color';
                            color.append(lbl);
                        }
                        const inp = document.createElement('toolcool-color-picker'); {
                            inp.color = item.color;
                            let initialChange = true;
                            inp.addEventListener('change', (evt)=>{
                                if (initialChange) {
                                    initialChange = false;
                                    inp.color = item.color;
                                    return;
                                }
                                item.color = evt.detail.rgb;
                                updatePreviewDebounced();
                                this.save();
                            });
                            color.append(inp);
                        }
                        wrap.append(color);
                    }
                    // title
                    const title = document.createElement('div'); {
                        title.classList.add('stsb--setting');
                        const lbl = document.createElement('div'); {
                            lbl.classList.add('stsb--label');
                            lbl.textContent = 'Title';
                            title.append(lbl);
                        }
                        const inp = document.createElement('input'); {
                            inp.classList.add('text_pole');
                            inp.value = item.title ?? '';
                            inp.addEventListener('input', ()=>{
                                item.title = inp.value;
                                updatePreviewDebounced();
                            });
                            title.append(inp);
                        }
                        wrap.append(title);
                    }
                    // badge (icon/text)
                    const badge = document.createElement('div'); {
                        badge.classList.add('stsb--setting');
                        const lbl = document.createElement('div'); {
                            lbl.classList.add('stsb--label');
                            lbl.textContent = 'Badge';
                            badge.append(lbl);
                        }
                        const inp = document.createElement('input'); {
                            inp.classList.add('text_pole');
                            inp.value = item.badge ?? '';
                            inp.addEventListener('input', ()=>{
                                item.badge = inp.value;
                                updatePreviewDebounced();
                            });
                            badge.append(inp);
                        }
                        wrap.append(badge);
                    }
                    // badge color
                    const badgeColor = document.createElement('div'); {
                        badgeColor.classList.add('stsb--setting');
                        const lbl = document.createElement('div'); {
                            lbl.classList.add('stsb--label');
                            lbl.textContent = 'Badge Text';
                            badgeColor.append(lbl);
                        }
                        const inp = document.createElement('toolcool-color-picker'); {
                            inp.color = item.badgeColor;
                            let initialChange = true;
                            inp.addEventListener('change', (evt)=>{
                                if (initialChange) {
                                    initialChange = false;
                                    inp.color = item.badgeColor;
                                    return;
                                }
                                item.badgeColor = evt.detail.rgb;
                                updatePreviewDebounced();
                                this.save();
                            });
                            badgeColor.append(inp);
                        }
                        wrap.append(badgeColor);
                    }
                    // badge bg
                    const badgeBackground = document.createElement('div'); {
                        badgeBackground.classList.add('stsb--setting');
                        const lbl = document.createElement('div'); {
                            lbl.classList.add('stsb--label');
                            lbl.textContent = 'Badge Color';
                            badgeBackground.append(lbl);
                        }
                        const inp = document.createElement('toolcool-color-picker'); {
                            inp.color = item.badgeBackground;
                            let initialChange = true;
                            inp.addEventListener('change', (evt)=>{
                                if (initialChange) {
                                    initialChange = false;
                                    inp.color = item.badgeBackground;
                                    return;
                                }
                                item.badgeBackground = evt.detail.rgb;
                                updatePreviewDebounced();
                                this.save();
                            });
                            badgeBackground.append(inp);
                        }
                        wrap.append(badgeBackground);
                    }
                    // trapScript
                    const trapScript = document.createElement('div'); {
                        trapScript.classList.add('stsb--setting');
                        const lbl = document.createElement('div'); {
                            lbl.classList.add('stsb--label');
                            lbl.textContent = 'Trap Script';
                            trapScript.append(lbl);
                        }
                        const inp = document.createElement('input'); {
                            inp.classList.add('text_pole');
                            inp.type = 'checkbox';
                            inp.checked = item.trapScript ?? false;
                            inp.addEventListener('click', ()=>{
                                item.trapScript = inp.checked;
                                updatePreviewDebounced();
                            });
                            trapScript.append(inp);
                        }
                        wrap.append(trapScript);
                    }
                    // clearInput
                    const clearInput = document.createElement('div'); {
                        clearInput.classList.add('stsb--setting');
                        const lbl = document.createElement('div'); {
                            lbl.classList.add('stsb--label');
                            lbl.textContent = 'Clear Input';
                            clearInput.append(lbl);
                        }
                        const inp = document.createElement('input'); {
                            inp.classList.add('text_pole');
                            inp.type = 'checkbox';
                            inp.checked = item.clearInput ?? false;
                            inp.addEventListener('click', ()=>{
                                item.clearInput = inp.checked;
                                updatePreviewDebounced();
                            });
                            clearInput.append(inp);
                        }
                        wrap.append(clearInput);
                    }
                    cont.append(wrap);
                }
                // cmd
                const cmd = document.createElement('div'); {
                    cmd.classList.add('stsb--setting');
                    const lbl = document.createElement('div'); {
                        lbl.classList.add('stsb--label');
                        lbl.textContent = 'Command';
                        cmd.append(lbl);
                    }
                    const inp = document.createElement('textarea'); {
                        inp.classList.add('text_pole');
                        inp.classList.add('monospace');
                        inp.value = item.command ?? '';
                        inp.placeholder = '/send {{var::input}} | /trigger';
                        inp.addEventListener('input', ()=>{
                            item.command = inp.value;
                            this.save();
                        });
                        cmd.append(inp);
                    }
                    cont.append(cmd);
                }
                li.append(cont);
            }
            const acts = document.createElement('div'); {
                acts.classList.add('.stsb--actions');
                const del = document.createElement('div'); {
                    del.classList.add('stsb--remove');
                    del.classList.add('menu_button');
                    del.classList.add('menu_button_icon');
                    del.classList.add('fa-solid');
                    del.classList.add('fa-trash');
                    del.classList.add('redWarningBG');
                    del.addEventListener('click', ()=>{
                        li.remove();
                        this.buttonList.splice(this.buttonList.indexOf(item), 1);
                        this.save();
                    });
                    acts.append(del);
                }
                li.append(acts);
            }
        }
        return li;
    }
}
