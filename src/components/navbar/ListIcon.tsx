"use client";
export function ListIcon({ listState, setListState }) {
    return (<div className={listState ? 'change w-9' : 'w-9'} onClick={() => {
        setListState(!listState);
    }}>
        <div className="bar1"></div>
        <div className="bar2"></div>
        <div className="bar3"></div>
    </div>);
}
;
