export function Capitalize(txt){
    return txt.trim().split(' ').filter(p => p.length > 0).map(l => {
        return l[0].toUpperCase() + l.slice(1).toLowerCase();
    }).join(" ");
}