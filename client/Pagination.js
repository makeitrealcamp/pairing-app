import React from 'react';

export default ({ page, pages, onPageChange }) => {
  return (
    <div className="pagination">
      {page > 1 ? <a href="#" onClick={(e) => onPageChange(e, page - 1)} className="previous" >&lt;&lt;</a> : null}
      {[...Array(pages)].map((p, i) => <a href="#" onClick={(e) => { onPageChange(e, i+1) }} className={`page ${page === i+1 ? 'current' : null}`} key={i}>{i+1}</a>)}
      <a href="#" onClick={(e) => onPageChange(e, page + 1)} className="next">&gt;&gt;</a>
    </div>
  )
}
