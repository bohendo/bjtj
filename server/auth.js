import db from './database'

const auth = (req, res, next) => {
  console.log(`${new Date().toISOString()} AUTH: new req received for ${req.path}`)

  const id = req.universalCookies.get('id') // id for IDentifier aka account
  const ag = req.universalCookies.get('ag') // ag for AutoGraph aka signature
  if (! id || ! ag) { // or id is a valid eth address or ag isn't valid
    res.json({ message: "I need your autograph before you can play" })
  }
 
  if (false) { // autograph is valid
    res.json({ message: "Sorry bud, this autograph don't look right" })
  }

  db // save this id & ag in our database if it's not there already
  .query(`SELECT * FROM bjvm_players where address='${id.toLower()}';`)
  .then(rows=>{ if (rows.length === 0) db.saveSig(id.toLower(), ag) }) 

  console.log(`${new Date().toISOString()} Player ${id} Successfully Authenticated!`)
  next()
}

export default auth
