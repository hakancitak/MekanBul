//anaSayfa controller metodu
//index.js dosyasındaki router.get('/',ctrlMekanlar.anaSayfa);
//ile metot url'ye bağlanıyor
var request =require('request');
var apiSecenekler={
	sunucu:'http://localhost:3000',
	apiYolu:'/api/mekanlar/',
	apiYolu2:'/api/tummekanlar/'
};


var mesafeyiFormatla=function(mesafe){
	var yeniMesafe,birim;
	if(mesafe>1){
		yeniMesafe=parseFloat(mesafe).toFixed(1);
		birim="km";
	}else{
		yeniMesafe=parseInt(mesafe*1000,10);
		birim='m';
	}
		return yeniMesafe+birim;

};

var anasayfaOlustur=function(req,res,cevap,mekanListesi){
	var mesaj;
	//gelen mekanListesi eğer dizi tipinde değilse hata ver
	if(!(mekanListesi instanceof Array)){
		mesaj="API HATASI: Bir Şeyler Ters Gitti!!";
		mekanListesi=[];
	}else{
		//eğer belielenen mesafe içinde mekan bulunmadıysa bilgilendirir
		if(!mekanListesi.length){
			mesaj="Civarda Herhangi Bir Mekan Bulunamadı";
		}
	}

	res.render('mekanlar-liste',
	{
		title:'Mekanbul-Yakınındaki Mekanları Bul',
		sayfaBaslik:{
			siteAd:'Mekanbul',
			aciklama:'Yakınınzdaki Kafeleri,Restorantları bulun!'
		},
		mekanlar:mekanListesi,
		mesaj:mesaj,
		cevap:cevap

	});
};


const anaSayfa=function(req,res){
	var istekSecenekleri;
	istekSecenekleri={
		//tam yol
		url:apiSecenekler.sunucu+apiSecenekler.apiYolu,
		//veri çekeceğimiz için get metodu
		method:"GET",
		//dönen veri json formatında olacak
		json:{},

		qs:{
			enlem:req.query.enlem,
			boylam:req.query.boylam
		}

	};
	request(
		istekSecenekleri,
		//geri dönüs
		function(hata,cevap,mekanlar){
			var i,gelenMekanlar;
			gelenMekanlar=mekanlar;
			if(!hata&&gelenMekanlar.length){
				for(i=0;i<gelenMekanlar.length;i++){
					gelenMekanlar[i].mesafe=mesafeyiFormatla(gelenMekanlar[i].mesafe);
				}
			}
			anasayfaOlustur(req,res,cevap,gelenMekanlar);
		}
		);
	
}
var mekanGuncelleSayfasiOlustur=function(req,res,mekanBilgisi){

    var text=(mekanBilgisi.imkanlar).toString();

	 res.render('mekan-guncelle',{
   	    baslik: mekanBilgisi.ad+ ' Mekanını Güncelle',
		sayfaBaslik: mekanBilgisi.ad+ ' Mekanını Güncelle',
		ad: mekanBilgisi.ad,
        adres: mekanBilgisi.adres,
        imkanlar: text,
        enlem: mekanBilgisi.koordinatlar.enlem,
        boylam:mekanBilgisi.koordinatlar.boylam,
        gunler1: mekanBilgisi.saatler[0].gunler,
        acilis1: mekanBilgisi.saatler[0].acilis,
        kapanis1: mekanBilgisi.saatler[0].kapanis,
        gunler2: mekanBilgisi.saatler[1].gunler,
        acilis2: mekanBilgisi.saatler[1].acilis,
        kapanis2: mekanBilgisi.saatler[1].kapanis,
		hata: req.query.hata
	});

};

const mekanGuncelle=function(req, res){
mekanBilgisiGetir(req, res, function(req, res, cevap){
	mekanGuncelleSayfasiOlustur(req, res, cevap);
});
};

var detaySayfasiOlustur=function(req,res,mekanDetaylari){
	res.render('mekan-detay',{
		baslik:mekanDetaylari.ad,
		sayfaBaslik:mekanDetaylari.ad,
		mekanBilgisi:mekanDetaylari
	});
}

var hataGoster=function(req,res,durum){
	var baslik,icerik;
	if(durum==404){
		baslik="404, Sayfa bulunamadı";
		icerik="Kusura bakma sayfa bulunamadı.";
	}
	else{
		baslik=durum+", Bir Şeyler Ters Gitti!!";
		içerik="Ters giden birşeyler var!!!";
	}
	res.status(durum);
	res.render('hata',{
		baslik:baslik,
		icerik:icerik
	});
};


var mekanBilgisiGetir=function(req,res,callback){
	var istekSecenekleri;
	//istek seçeneklerinş ayarla.
	istekSecenekleri={
		//tam yol
		url:apiSecenekler.sunucu + apiSecenekler.apiYolu+req.params.mekanid,
		//veriçekeceğiömiz için GET metodunu kullan
		method:"GET",
		//Dönen veri json formatında olacak
		json:{}

	};
	request(
		istekSecenekleri,
		//geri dönüş metodu
		function(hata,cevap,mekanDetaylari){
			var gelenMekan=mekanDetaylari;
			if(!hata){
				//enlem boylam bir dizi şeklinde bunu ayırı.
				///0'da enlem 1'de boylam var
				gelenMekan.koordinatlar ={
					enlem : mekanDetaylari.koordinatlar[0],
					boylam : mekanDetaylari.koordinatlar[1]
				};
				callback(req,res,gelenMekan);
			}else{
				hataGoster(req,res,cevap.statusCode);
			}
		}


		);
};





//mekanBilgisi controller metodu
//index.js dosyasındaki router.get('/mekan', ctrlMekanlar.mekanBilgisi);
//ile metot url'ye bağlanıyor
const mekanBilgisi=function(req,res,callback){
	mekanBilgisiGetir(req,res,function(req,res,cevap){
		detaySayfasiOlustur(req,res,cevap);
	});


	
};

var yorumSayfasiOlustur=function(req,res,mekanBilgisi){
	res.render('yorum-ekle',{
		baslik: mekanBilgisi.ad+' Mekanına Yorum Ekle',
		sayfaBaslik:mekanBilgisi.ad+' Mekanına Yorum Ekle',
		hata:req.query.hata
	
   	});
};


//yorumEkle controller metodu
//index.js dosyasındaki router.get('/mekan/yorum/yeni', ctrlMekanlar.yorumEkle);
//ile metot url'ye bağlanıyor
const yorumEkle=function(req,res){
	mekanBilgisiGetir(req,res,function(req,res,cevap){
		yorumSayfasiOlustur(req,res,cevap);
	});
		
}

const yorumumuEkle=function(req,res){
	var istekSecenekleri,gonderilenYorum,mekanid;
	mekanid=req.params.mekanid;
	gonderilenYorum={
		yorumYapan:req.body.name,
		puan:parseInt(req.body.rating,10),
		yorumMetni:req.body.review
	};
	istekSecenekleri={
		url : apiSecenekler.sunucu + apiSecenekler.apiYolu + mekanid + '/yorumlar',
		method : "POST",
		json : gonderilenYorum
	};
	if(!gonderilenYorum.yorumYapan || !gonderilenYorum.puan || !gonderilenYorum.yorumMetni){
		res.redirect('/mekan/'+mekanid+'/yorum/yeni?hata=evet');
	}else{
		request(
			istekSecenekleri,
			function(hata,cevap,body){
				if(cevap.statusCode===201){
					res.redirect('/mekan/'+mekanid);
				}
				else if(cevap.statusCode===400 && body.name && body.name ==='ValidationError'){
					res.redirect('/mekan/'+mekanid+'/yorum/yeni?hata=evet');
				}
				else{
					hataGoster(req,res,cevap.statusCode);
				}
			}
			);
	}

};





var mekanEkleSayfasiOlustur=function(req,res,mekanBilgisi){
	 res.render('mekan-ekle',{
   	title:'Yeni Mekan Ekle',
   	baslik: 'Yeni Mekan Ekle',
	sayfaBaslik: 'Yeni Mekan Ekle',
	hata: req.query.hata
	});

};

const mekanEkle=function(req, res,mekanBilgisi){
		mekanEkleSayfasiOlustur(req, res, mekanBilgisi)
}

const mekaniEkle=function(req,res){
	var istekSecenekleri,gonderilenMekan,apiYolu;
	
	gonderilenMekan= {
            ad: req.body.ad,
            adres: req.body.adres,
            imkanlar: req.body.imkanlar,
            enlem: req.body.enlem, 
            boylam: req.body.boylam,
            gunler1: req.body.gunler1,
            acilis1: req.body.acilis1,
            kapanis1: req.body.kapanis1,
            kapali1:false,
            gunler2: req.body.gunler2,
            acilis2: req.body.acilis2,
            kapanis2: req.body.kapanis2,
            kapali2:false

	};
	istekSecenekleri= {
		url : apiSecenekler.sunucu+apiSecenekler.apiYolu,
		method : "POST",
		json : gonderilenMekan
	};
	if(!gonderilenMekan.ad || !gonderilenMekan.adres || !gonderilenMekan.imkanlar || !gonderilenMekan.enlem || !gonderilenMekan.boylam || !gonderilenMekan.gunler1 || !gonderilenMekan.acilis1 || !gonderilenMekan.kapanis1 || !gonderilenMekan.gunler2 || !gonderilenMekan.acilis2 || !gonderilenMekan.kapanis2){
		res.redirect('/admin/mekan/yeni?hata=evet');
	}else{
		request(
			istekSecenekleri,
				function(hata,cevap,body){
				if (cevap.statusCode === 201) {
					
					res.redirect('/admin');

				}
				else if(cevap.statusCode === 400 && body.ad === "ValidationError") {
					res.redirect('/admin/mekan/yeni?hata=400');
				}else{
					hataGoster(req,res,cevap.statusCode);
				}
			}

		);
	}
	
};

var adminSayfaOlustur=function(req,res,cevap,tumMekanlariListele){
	var mesaj;
	//gelen mekanListesi eğer dizi tipinde değilse hata ver
	if(!(tumMekanlariListele instanceof Array)){
		mesaj="API HATASI: Bir Şeyler Ters Gitti!!";
		tumMekanlariListele=[];
	}else{
		//eğer belielenen mesafe içinde mekan bulunmadıysa bilgilendirir
		if(!tumMekanlariListele.length){
			mesaj="Civarda Herhangi bir mekan bulunamadı!!";
		}
	}
	res.render('admin',
	{
		title:'Mekanbul-Admin',
		sayfaBaslik:{
			siteAd:'Mekanbul-Admin',
			aciklama:'Mekanları Yönetin'
		},
		mekanlar:tumMekanlariListele,
		mesaj:mesaj,
		
		cevap:cevap


	});

}

const adminSayfa =function(req,res){
	var istekSecenekleri;
	istekSecenekleri={
		//tam yol
		url:apiSecenekler.sunucu+apiSecenekler.apiYolu2 ,
		//veri çekeceğimiz için get metodu
		method:"GET",
		//dönen veri json formatında olacak
		json:{}
	};
	request(
		istekSecenekleri,
		//geri dönüs
		function(hata,cevap,mekan){
			gelenMekanlar=mekan;
			if(!hata&&gelenMekanlar.length){
				for(i=0;i<gelenMekanlar.length;i++){
					gelenMekanlar[i];
				}
			}
			
			adminSayfaOlustur(req,res,cevap,gelenMekanlar);
		}
		);
}

const mekaniGuncelle=function(req,res){
	var istekSecenekleri,gonderilenMekan,apiYolu;
	apiYolu='/api/mekanlar/';
	mekanid=req.params.mekanid;

	gonderilenMekan={
	        ad: req.body.ad,
            adres: req.body.adres,
            imkanlar: req.body.imkanlar,
            enlem:req.body.enlem, 
            boylam: req.body.boylam,
            gunler1: req.body.gunler1,
            acilis1: req.body.acilis1,
            kapanis1: req.body.kapanis1,
            kapali1:false,
            gunler2: req.body.gunler2,
            acilis2: req.body.acilis2,
            kapanis2: req.body.kapanis2,
            kapali2:false

        };

	istekSecenekleri= {
		url : apiSecenekler.sunucu+apiYolu+req.params.mekanid,
		method : "PUT",
		json : gonderilenMekan
	};
	if(!gonderilenMekan.ad){
		res.redirect('/admin/mekan/'+mekanid+'/guncelle?hata=evet');
	}else{
		request(
			istekSecenekleri,
				function(hata,cevap,body){
				if (cevap.statusCode === 200) {
					res.redirect('/admin');
				}
				else if(cevap.statusCode === 400 && body.ad && body.ad === "ValidationError") {
					res.redirect('/admin/mekan/'+mekanid+'/guncelle?hata=400');
				}else{
					hataGoster(req,res,cevap.statusCode);
				}
			}
		);
	}
};
const mekanSil=function(req,res){
	var istekSecenekleri,gonderilenMekan,apiYolu;
	apiYolu='/api/mekanlar/';
	mekanid=req.params.mekanid;
	istekSecenekleri= {
		url : apiSecenekler.sunucu+apiYolu+req.params.mekanid,
		method : "DELETE",
		json : {}
	};
	request(
			istekSecenekleri,
				function(hata,cevap){
				if (cevap.statusCode === 204) {
					res.redirect('/admin');
				}
				else if(cevap.statusCode === 400) {
					res.redirect('/admin/mekan/'+mekanid+'/sil?hata=400');
				}else{
					hataGoster(req,res,cevap.statusCode);
				}
			}
		);
};

//metotlarımızı kullanmak üzere dış dünyaya aç
//diğer dosyalardan require ile alabilmemizi sağlayacak
module.exports = {

anaSayfa,

mekanBilgisi,
yorumEkle,
yorumumuEkle,
mekanEkle,
mekaniEkle,
adminSayfa,
mekanGuncelle,
mekaniGuncelle,
mekanSil




};

