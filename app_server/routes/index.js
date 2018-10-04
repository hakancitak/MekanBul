
var express=require('express');
var router=express.Router();

//mekanlar.js yolu
var ctrlMekanlar=require('../controllers/mekanlar');
//digerleri.js yolu
var ctrlDigerleri=require('../controllers/digerleri');

//Anasayfa rotası
router.get('/',ctrlMekanlar.anaSayfa);
router.get('/mekan/:mekanid', ctrlMekanlar.mekanBilgisi);
router.get('/mekan/:mekanid/yorum/yeni', ctrlMekanlar.yorumEkle);
router.post('/mekan/:mekanid/yorum/yeni',ctrlMekanlar.yorumumuEkle);


//admin rotası

router.get('/admin',ctrlMekanlar.adminSayfa);
router.get('/admin/mekan/yeni',ctrlMekanlar.mekanEkle);
router.post('/admin/mekan/yeni',ctrlMekanlar.mekaniEkle);

router.get('/admin/mekan/:mekanid/guncelle',ctrlMekanlar.mekanGuncelle);
router.post('/admin/mekan/:mekanid/guncelle',ctrlMekanlar.mekaniGuncelle);

router.get('/admin/mekan/:mekanid/sil',ctrlMekanlar.mekanSil);


//diğer sayfalar
router.get('/hakkinda', ctrlDigerleri.hakkinda);


module.exports=router;

