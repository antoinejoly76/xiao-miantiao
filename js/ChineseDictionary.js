/**
 * Created by antoine on 23/11/16.
 */


// Class Chinese Dictionary

/* Methods
 initArray1: Load CSV files in an Array of Object = Dictionary
 printDic1: print the dictionary in the console


 */

// Registering events for various buttons
var seconds = 0,
    minutes = 0,
    hours = 0;
var t = 0;

window.onload = function() {
    document.getElementById("choiceintro2").addEventListener("click", SH_initDic);
    // document.getElementById("saveSession").addEventListener("click", saveSession);
    document.getElementById("choiceintro1").addEventListener("click", loadSession);
    // document.getElementById("nextSession").addEventListener("click", SH_initNewSession);
    //   document.getElementById("frontcard").addEventListener("click", UI_switchCard);
    //  document.getElementById("chartobreak").addEventListener("click", UI_printKP);
    document.getElementById("answer0").addEventListener("click", function() {
        SH_movetoNextWord(0);
    });
    document.getElementById("answer1").addEventListener("click", function() {
        SH_movetoNextWord(1);
    });
    document.getElementById("answer2").addEventListener("click", function() {
        SH_movetoNextWord(2);
    });
    document.getElementById("answer3").addEventListener("click", function() {
        SH_movetoNextWord(3);
    });
    document.getElementById("answer4").addEventListener("click", function() {
        SH_movetoNextWord(4);
    });
    document.getElementById("answer5").addEventListener("click", function() {
        SH_movetoNextWord(5);
    });
    //document.getElementById("nextSession").addEventListener("click", SH_initNewSession);

    document.getElementById("choiceintro1").addEventListener("mouseover", function() {
        UI_lightencolor("choiceintro1");
    });
    document.getElementById("choiceintro2").addEventListener("mouseover", function() {
        UI_lightencolor("choiceintro2");
    });
    document.getElementById("choiceintro3").addEventListener("mouseover", function() {
        UI_lightencolor("choiceintro3");
    });
    document.getElementById("choiceintro4").addEventListener("mouseover", function() {
        UI_lightencolor("choiceintro4");
    });
    document.getElementById("choiceintro1").addEventListener("mouseout", function() {
        UI_darkencolor("choiceintro1");
    });
    document.getElementById("choiceintro2").addEventListener("mouseout", function() {
        UI_darkencolor("choiceintro2");
    });
    document.getElementById("choiceintro3").addEventListener("mouseout", function() {
        UI_darkencolor("choiceintro3");
    });
    document.getElementById("choiceintro4").addEventListener("mouseout", function() {
        UI_darkencolor("choiceintro4");
    });

    $('.fixed-action-btn.toolbar').openToolbar();
    UI_getRandomChinaPic();
    UI_startTime();
    loadSaveDate();


};

Number.prototype.round = function(decimals) { //get a function to round at 2 decimals - @R0.20.1
    return Number((Math.round(this + "e" + decimals) + "e-" + decimals));
};

// Class Chinese Dictionary
function ChineseDictionary() {
    this.arrayWords = {}; // contains all the Words Objects. the key is a String representation of the word.
    this.arrayCharacters = {}; // contains all the Characters Objects. the key is a character representation of the characters
    this.arrayKP = {}; // contains the KP Objects loosely based on the Chracters Class.  @TODO make the KP class inherit from the Characer class to simplify code
}

/* Prototype Chinese Dictionary */

ChineseDictionary.prototype = {

    // initArray1 loads a CSV file with tabbed columns and according to the dictype
    // parameter fills the right associative array of ChineseDictionary object see above.
    // the calls to XMLHttpRequest are asynchronous  and therefore a callback function is
    // used, only after the third call to initArray1 has been made (i.e all three tables have been initiated)

    initArray1: function(this_file, dictype, callback) {

        // using deprecated XMLHttpRequest to read file
        // (works at time of print (2015-10-05))
        var xhr = new XMLHttpRequest();
        var filepath = "dicfiles/" + this_file;
        // open the file
        // use GET for faster performance but use POST (no size limits) for large files
        xhr.open('POST', filepath, true);
        xhr.onreadystatechange = function() {
            if (xhr.readyState == 4 /* complete */ ) {
                if (xhr.status == 200) {
                    console.log(xhr.responseText);
                    // return contents of target file to JS variable
                    var my_csv_file_contents = xhr.responseText;

                    // split contents into array of rows
                    // store each line of the CSV file into a JS array
                    var my_csv_rows_array = my_csv_file_contents.split("\n");

                    // declare a blank associative array to store file contents
                    var obj_temp = {};

                    // loop through JS array using Array.prototype.forEach()
                    my_csv_rows_array.forEach(function(row_content, row_index) {

                        // clear and declare the array
                        var column_values = [];

                        // regex to ignore commas between double-quotes
                        column_values = row_content.split("\t");

                        // prevents JS error where results unmatched
                        column_values = column_values || [];

                        // ignore row if first item is blank (allows for blank excel lines)
                        if (column_values[0] != '') {

                            // remove any/all double-quotes in this column value  // found this method more reliable than using regex
                            removed_quotes = column_values[1].split('|t').join('');

                            // populate my array with an object
                            if (dictype == "Words") {
                                obj_temp[column_values[0]] = new Word(column_values[0], column_values[2], column_values[4], column_values[5]); // associative array syntax
                            } else if (dictype == "Characters") {
                                obj_temp[column_values[0]] = new Character(column_values[0], column_values[1], column_values[2], column_values[5], column_values[4], column_values[6], column_values[3]);
                            } else { // this is a KP object
                                obj_temp[column_values[0]] = new CharacterKP(column_values[0], column_values[1], column_values[2], column_values[3], column_values[4], column_values[5], column_values[8], column_values[9],
                                    column_values[10]);
                            }
                        }
                    });
                    if (dictype == "Words") {
                        this.arrayWords = obj_temp; // object with Words or Characters as key and the Word or Character object as Property value.
                    } else if (dictype == "Characters") {
                        this.arrayCharacters = obj_temp;
                    } else {
                        this.arrayKP = obj_temp;
                    }

                    if (Object.keys(this.arrayWords).length > 0 && Object.keys(this.arrayCharacters).length > 0 && Object.keys(this.arrayKP).length > 0) { //everything has been done and therefore the initPostLoad method can be
                        // called

                        callback();
                    }


                } else console.log("Did not work");
            }
        }.bind(this); // necessary to bind this to the scope of ChineseDictionary
        //@TODO verify that bind is necessary


        // set header to CSV mimetype
        xhr.setRequestHeader('Content-Type', 'text/csv');

        // send request to the server
        xhr.send();

    },

    //printDic function is to be used for debugging only
    printDic: function() {
        this.arrayWords.forEach(function(arrayElem) {
            console.log(arrayElem.character, "\t", arrayElem.pinyin, "\t", arrayElem.translation);
            //    document.querySelector("#table").innerHTML += arrayElem.character + "\t";

        });

    },


    getCharacter: function(char1) {
        return this.arrayCharacters[char1]; // since arrayCharacters is an object = associative array, we can pass the key directly, ie the textual representation of the character
    },

    getCharacterKP: function(char1) {
        return this.arrayKP[char1]; // same principle as above
    },

    getWord: function(word1) {
        return this.arrayWords[word1]; // same principle as above
    },

    getNumberOfWords: function() {
        return Object.keys(this.arrayWords).length; // standard way of getting number of items for an associative array
    },

    getNumberOCharacters: function() {
        return Object.keys(this.arrayCharacters).length; // same as above
    },

    getWordsWithGivenCharacter: function(char1, wordtoignore) {
        // get the list in the Dictionary of all the words containing a given character. If a wordtoignore parameter is passed, the word passed is removed from the results list if it is found.
        var arrayWords = [];
        for (var keys in this.arrayWords) {
            if (keys.includes(char1)) {
                arrayWords.push(this.arrayWords[keys]);
            }
        }
        if (wordtoignore) {
            var index = arrayWords.indexOf(wordtemp);
            arrayWords.splice(index, 1);
        }
        return arrayWords;
    },

    setKPComponents: function() {
        // once all the loading has been done, the goal is to create a linked list with all Characters components being linked to their "father"
        //@TODO think how to extend that to n components
        for (keys in this.arrayKP) {
            var component1 = null;
            var component2 = null;
            var component1txt = this.arrayKP[keys].getComponent1Txt();
            var component2txt = this.arrayKP[keys].getComponent2Txt();
            if (component1txt == "none" || component1txt.includes("symb")) {
                component1 = null;
            } else {
                component1 = this.arrayKP[component1txt];
            }
            if (component2txt == "none" || component2txt.includes("symb")) {
                component2 = null;
            } else {
                component2 = this.arrayKP[component2txt];
            }
            this.arrayKP[keys].component1Obj = component1;
            this.arrayKP[keys].component2Obj = component2;
        }
    }
};

/* Class RecordsStats */

function RecordsStats(dic1) {
    this.Session = {};
    this.Encountered = {};
    this.Total = {};
    // this.MasteredPcSession = 0,
    // this.GoodPcSession = 0,
    // this.NbCardsSession = 0,
    // this.MasteredPcEncountered = 0,
    // this.GoodPcEncountered = 0,
    // this.Encountered = 0,
    // this.MasteredPcTotal = 0,
    // this.GoodPcTotal = 0,
    // this.TotalCards = 0
}

RecordsStats.prototype = {

    resetSessionStats: function() {
        for (var i = 0; i < 6; i++)
            this.Session[i] = 0;
        this.Session.nbCards = 0;
    },

    updateCurrentSession: function(answer) {
        this.Session[answer]++;
        this.Session.nbCards++;
    },

    getnbAnswersPerScore: function(answer) {
        var nb = this.Session[answer];
        if (nb > 0) return nb;
        else return "";
    },

    getnbCardsSession: function(answer) {
        return this.Session.nbCards;
    }


    // updateEncountered: function (word, previousEF) {
    //     if (word.getNumberOfEncounters() == 1) {
    //         this.Encountered++;
    //
    //         if (word.getEF() >= 3.0) {
    //             this.MasteredPcEncountered++;
    //         } else if (word.getEF() >= 2.5) {
    //             this.GoodPcEncountered++;
    //         }
    //     } else {
    //
    //         if (word.getEF() >= 3.0) {
    //             this.MasteredPcEncountered++;
    //         } else if (word.getEF() >= 2.5) {
    //             this.GoodPcEncountered++;
    //         }
    //         if (previousEF >= 3.0) {
    //             this.MasteredPcEncountered--;
    //         } else if (previousEF >= 2.5) {
    //             this.GoodPcEncountered--;
    //         }
    //     }
    // }

};
/* Class DeckOfCards */

function DeckofCards(deck, number) {
    this.deckarray = {};
    this.listofcards = [];
    this.index = 0;
    this.numberOfCardsPerSession = number;
    if (number < 0) { // this is used only to fill the deck with all the remaining cards, not the session deck
        var i = 0;
        for (keys in deck.arrayWords) {
            this.deckarray[keys] = deck.arrayWords[keys];
            this.listofcards[i] = deck.arrayWords[keys];
            i++;
        }
    } else {
        for (i = 0; i < number; i++) {
            var wordtemp = deck.getRandomWord();
            deck.removeWord(wordtemp);
            this.addWord(wordtemp); //We  "transfer" the word from the full deck to the session deck
        }
    }
    this.currentword = this.listofcards[this.index];
}

DeckofCards.prototype = {
    getRandomWord: function() {
        var keys = Object.keys(this.deckarray);
        return this.deckarray[keys[Math.floor(keys.length * Math.random())]];
    },

    removeWord: function(Word1) {
        var index = this.listofcards.indexOf(Word1);
        this.listofcards.splice(index, 1);
        delete this.deckarray[Word1];
    },

    addWord: function(Word1) {
        this.deckarray[Word1.getWord()] = Word1;
        this.listofcards.push(Word1);
    },

    getCurrentWord: function() {
        return this.currentword;
    },

    moveToNextWord: function() {
        if (this.index < this.listofcards.length - 1) {
            this.index++;
        } else {
            this.index = 0;
        }
        this.currentword = this.listofcards[this.index];
    },
    getNumberOfWords: function() {
        return this.listofcards.length;
    },
    getCardIndex: function() {
        return this.index + 1;
    },
    getNumberofCardsPerSession: function() {
        return this.numberOfCardsPerSession;
    },

    hasCardsRemaining: function() {
        return (!this.getNumberOfWords() == 0);
    },

    allocateCardsforNextSession: function(dic1, deck) {
        var wordtemp = {};

        for (keys in dic1.arrayWords) {
            if (dic1.arrayWords[keys].getNumberOfEncounters() > 0) {
                if (dic1.arrayWords[keys].getIF() == 1) {
                    this.addWord(dic1.arrayWords[keys]);
                    deck.removeWord(wordtemp); //Fix to prevent same word to appear twice in a session - @R0.20.1
                } else {
                    dic1.arrayWords[keys].diminishIF()
                }
            }
        }


        var n = this.getNumberOfWords();
        // now if there are not enough of those characters we add random new characters (they are in dic 1 but not in our remainingDeck
        for (i = 0; i < this.getNumberofCardsPerSession() - n; i++) { // loop to reach number of characters per session
            wordtemp = deck.getRandomWord();
            deck.removeWord(wordtemp);
            this.addWord(wordtemp); //We  "transfer" the word for the full deck to the session deck
        }
        this.index = 0;
        this.currentword = this.listofcards[this.index];
    }
};

/* Class Word */

function Word(word, pinyin, translation, HSKlevel) {
    this.word = word;
    this.pinyin = pinyin;
    this.translation = translation;
    this.HSKlevel = HSKlevel;
    this.nbOfEncounters = 0;
    this.nbOfSuccesses = 0;
    this.easinessFactor = 2.5;
    this.n = 0;
    this.intervalFactor = 1;
    this.lastintervalFactor = 1;
    this.characters = [];
    this.addCharacters();
}


Word.prototype = {
    getWord: function() {
        return this.word;
    },

    getPinyin: function() {
        return this.pinyin;
    },

    getTranslation: function() {
        return this.translation;
    },

    getHSKLevel: function() {
        return this.HSKlevel;
    },

    addCharacters: function() {
        for (var i = 0; i < this.word.length; i++) {
            this.characters.push(this.word.charAt(i));
        }
    },

    addEncounter: function() {
        this.nbOfEncounters++;
        this.n++;
    },


    updateEF: function(status) {
        if (status <= 2) {
            this.n = 1; //the schedule is reset but not the EF !
        }
        this.easinessFactor = this.easinessFactor - 0.8 + 0.28 * status - 0.02 * status * status; // SM2 algorithm
        if (this.easinessFactor < 1.3) {
            this.easinessFactor = 1.3;
        }
    },

    updateInt: function() {
        if (this.n == 1)
            this.intervalFactor = 1;
        else if (this.n == 2)
            this.intervalFactor = 4;
        else
            this.intervalFactor = this.intervalFactor * this.easinessFactor;
        this.lastintervalFactor = this.intervalFactor;
    },

    getEF: function() {
        return this.easinessFactor.round(1); //Round EF to one decimal- @R0.20.1
    },

    getIF: function() {
        return Math.floor(this.intervalFactor);
    },

    getLastIF: function() {
        return Math.floor(this.lastintervalFactor); //Use last IF and not decrease each round  @R0.20.1
    },


    getNumberOfEncounters: function() {
        return this.nbOfEncounters;
    },

    diminishIF: function() {
        this.intervalFactor--;
    }

};

/* Class Character*/

function Character(character, pinyin, translation, HSKlevel, strokescount, frequency, radical) {
    this.character = character;
    this.pinyin = pinyin;
    this.translation = translation;
    this.HSKlevel = HSKlevel;
    this.radical = radical;
    this.strokescount = strokescount;
    this.frequency = frequency;
}


Character.prototype = {
    getCharacter: function() {
        return this.character;
    },

    getPinyin: function() {
        return this.pinyin;
    },

    getTranslation: function() {
        return this.translation;
    },

    getHSKLevel: function() {
        return this.HSKlevel;
    },

    getStrokesCount: function() {
        return this.strokescount;
    },

    getFrequency: function() {
        return this.frequency;
    },

    getRadical: function() {
        return this.radical;
    }
};

function CharacterKP(character, pinyin, translation, component1, component2, mnemo, cat1, cat2, cat3) {
    this.character = character;
    this.pinyin = pinyin;
    this.translation = translation;
    this.component1Txt = component1;
    this.component2Txt = component2;
    this.component1Obj = {};
    this.component2Obj = {};
    this.mnemo = mnemo;
    this.cat1 = cat1;
    this.cat2 = cat2;
    this.cat3 = cat3;
}


CharacterKP.prototype = {
    getCharacter: function() {
        return this.character;
    },

    getPinyin: function() {
        return this.pinyin;
    },

    getTranslation: function() {
        return this.translation;
    },

    getComponent1Txt: function() {
        return this.component1Txt;
    },

    getComponent2Txt: function() {
        return this.component2Txt;
    },

    getComponent1Obj: function() {
        return this.component1Obj;
    },

    getComponent2Obj: function() {
        return this.component2Obj;
    },

    getCat1: function() {
        return this.cat1;
    },

    getCat2: function() {
        return this.cat2;
    },

    getCat3: function() {
        return this.cat3;
    },

    getTone: function {

    }
    print: function() {
        str = "";
        str += "Character :" + this.getCharacter() + "<br>";
        str += "Pinyin :" + this.getPinyin() + "<br>";
        str += "Translation :" + this.getTranslation() + "<br>";
        str += "Component1 Txt :" + this.getComponent1Txt() + "<br>";
        str += "Component2 Txt :" + this.getComponent2Txt() + "<br>";
        str += "Cat1:" + this.getCat1() + "<br>";
        str += "---------" + "<br>";
        str += "Component1" + this.getComponent1Obj() + "<br>";
        str += "Component2" + this.getComponent2Obj() + "<br>";
        return str;
    },

    hasComponents: function() {
        return (this.component1Obj || this.component2Obj);
    }
};



/* Main functions */

var dic1 = {};
var deckRemainingCharacters = {};
var deckSession = {};
var stats = {};
var lastsavedate = 0;

function SH_initDic() {

    dic1 = new ChineseDictionary("test", "L3"); // Force HSK 3 for now
    dic1.initArray1("HSK3.txt", "Words", SH_initPostLoad);
    dic1.initArray1("characters.txt", "Characters", SH_initPostLoad);
    dic1.initArray1("KP.txt", "KP", SH_initPostLoad);


}


function SH_initPostLoad() {
    dic1.setKPComponents(); // link a KP character to his KP components
    deckRemainingCharacters = new DeckofCards(dic1, -1);
    deckSession = new DeckofCards(deckRemainingCharacters, 30);
    stats = new RecordsStats(dic1);
    SH_initNewSession();
    UI_logStatusBar("New deck generated successfully")
}

function SH_initNewSession() {
    deckSession.allocateCardsforNextSession(dic1, deckRemainingCharacters);
    stats.resetSessionStats();
    wordtemp = deckSession.getCurrentWord();
    wordtemp.addEncounter();
    UI_showMainPage_HideIntro();
    timer(); // start the clock
    UI_Update();
    UI_logStatusBar("Next session initiated successfully");
}

function SH_movetoNextWord(status) {
    // wordtemp = deckSession.getCurrentWord();
    var oldEF = wordtemp.getEF();
    wordtemp.updateEF(status);
    wordtemp.updateInt();

    stats.updateCurrentSession(status);
    // stats.updateEncountered(wordtemp, oldEF);

    deckSession.removeWord(wordtemp);
    saveSession(); // Auto save
    if (!deckSession.hasCardsRemaining()) {
        UI_EndSession();
    } else {
        wordtemp = deckSession.moveToNextWord();
        wordtemp = deckSession.getCurrentWord();
        wordtemp.addEncounter(); // here we update n and nbOfEncounters
    }
    UI_Update();

}

function UI_EndSession() {
    document.querySelector("#table").innerHTML = "END OF THIS SESSION";
}

function UI_Update() {
    if (!deckSession.hasCardsRemaining()) {
        document.querySelector("#nextSession").disabled = false;
    } else {
        document.querySelector("#table").innerHTML = wordtemp.getWord();
        document.querySelector("#answer").innerHTML = wordtemp.getWord();
        document.querySelector("#pinyin").innerHTML = wordtemp.getPinyin();
        document.querySelector("#translation").innerHTML = wordtemp.getTranslation();
        // document.querySelector("#nextSession").disabled = true;
        document.querySelector("#EF").innerHTML = wordtemp.getEF();
        document.querySelector("#IF").innerHTML = wordtemp.getLastIF(); //Display last IF instead of IF to fix bug @R0.20.1
    }
    document.querySelector("#countans0").innerHTML = stats.getnbAnswersPerScore(0);
    document.querySelector("#countans1").innerHTML = stats.getnbAnswersPerScore(1);
    document.querySelector("#countans2").innerHTML = stats.getnbAnswersPerScore(2);
    document.querySelector("#countans3").innerHTML = stats.getnbAnswersPerScore(3);
    document.querySelector("#countans4").innerHTML = stats.getnbAnswersPerScore(4);
    document.querySelector("#countans5").innerHTML = stats.getnbAnswersPerScore(5);
}


function saveSession() {
    var ind = 0;
    chrome.storage.local.set({
        ds: deckSession
    }, function() {
        ind++;
        if (ind == 4) UI_logStatusBar("Progress saved successfully");
    });
    chrome.storage.local.set({
        dr: deckRemainingCharacters
    }, function() {
        ind++;
        if (ind == 4) UI_logStatusBar("Progress saved successfully");
    });
    chrome.storage.local.set({
        dic: dic1
    }, function() {
        ind++;
        if (ind == 4) UI_logStatusBar("Progress saved successfully");
    });
    chrome.storage.local.set({
        st: stats
    }, function() {
        ind++;
        if (ind == 4) UI_logStatusBar("Progress saved successfully");
    });
    lastsavedate = {
        date: Date.now()
    };
    chrome.storage.local.set(lastsavedate);
}


function loadSession() {
    var ind = 0; //Reload all the objects and prototypes

    //Chinese Dictionary
    chrome.storage.local.get("dic", function(data) {
        dic1 = data.dic;
        dic1.__proto__ = ChineseDictionary.prototype;

        for (var keys in dic1.arrayWords)
            dic1.arrayWords[keys].__proto__ = Word.prototype;

        for (var keys in dic1.arrayCharacters)
            dic1.arrayCharacters[keys].__proto__ = Character.prototype;

        for (var keys in dic1.arrayKP)
            dic1.arrayKP[keys].__proto__ = CharacterKP.prototype;

        ind++;
        if (ind == 5) {
            UI_logStatusBar("Progress loaded successfully - " + new Date(lastsavedate));
            SH_initNewSession();

        }
    });


    //Decks

    chrome.storage.local.get("ds", function(data) {
        deckSession = data.ds;
        deckSession.__proto__ = DeckofCards.prototype;
        for (var i = 0; i < deckSession.getNumberOfWords(); i++)
            deckSession.listofcards[i].__proto__ = Word.prototype;
        deckSession.currentword = deckSession.listofcards[deckSession.index];
        ind++;
        if (ind == 5) {
            UI_logStatusBar("Progress loaded successfully - " + new Date(lastsavedate));
            SH_initNewSession();

        }
    });



    chrome.storage.local.get("dr", function(data) {
        deckRemainingCharacters = data.dr;
        deckRemainingCharacters.__proto__ = DeckofCards.prototype;
        for (var i = 0; i < deckRemainingCharacters.getNumberOfWords(); i++)
            deckRemainingCharacters.listofcards[i].__proto__ = Word.prototype;
        deckRemainingCharacters.currentword = deckRemainingCharacters.listofcards[deckRemainingCharacters.index];
        ind++;
        if (ind == 5) {
            UI_logStatusBar("Progress loaded successfully - " + new Date(lastsavedate));
            SH_initNewSession();
        }
    });




    //Stats

    chrome.storage.local.get("st", function(data) {
        stats = data.st;
        stats.__proto__ = RecordsStats.prototype;
        ind++;
        if (ind == 5) {
            UI_logStatusBar("Progress loaded successfully - " + new Date(lastsavedate));
            SH_initNewSession();
        }
    });


    chrome.storage.local.get("date", function(data) {
        lastsavedate = data.date;
        ind++;
        if (ind == 5) {
            UI_logStatusBar("Progress loaded successfully " + new Date(lastsavedate)); //Fixed the date format when loading session.  @R0.20.1
            SH_initNewSession();
        }
    });
}

function loadSaveDate() {
    chrome.storage.local.get("date", function(data) {
        lastsavedate = data.date;
        document.getElementById("lastsavedate").innerHTML = new Date(lastsavedate);
    });
}


function UI_showCharDetails(chartext1) {
    document.getElementById("panelcontent1").innerHTML = UI_displayChar(chartext1);
}



function UI_displayChars_answer(Word1) {
    wordtemp = deckSession.getCurrentWord();
    var strInner = "";
    for (var i = 0; i < wordtemp.characters.length; i++) {
        var character1 = dic1.getCharacter(wordtemp.characters[i]);
        strtemp = '<span class="characterans">';
        strtemp += character1.getCharacter();
        strtemp += "</span>";
        strInner += strtemp;
    }
    strtemp = '<div class "backother"><span class="otherans">' + wordtemp.getPinyin() + '</span>';
    strtemp += '<span class="otherans">' + wordtemp.getTranslation() + '</span></div>'
    strInner += strtemp;


    return strInner;
}


function UI_displayChars_menu(Word1) {
    wordtemp = deckSession.getCurrentWord();
    var strInner = '<div class="pure-menu pure-menu-horizontal"><ul class="pure-menu-list">';
    for (var i = 0; i < wordtemp.characters.length; i++) {
        var character1 = dic1.getCharacter(wordtemp.characters[i]);
        strtemp = '<li class="pure-menu-item"> <a href="#" class="pure-menu-link" id="charmenu' + i + '">';
        strtemp += character1.getCharacter();
        strtemp += '</a></li>';
        strInner += strtemp;
    }
    strtemp = '</ul></div>';
    strInner += strtemp;

    return strInner;
}


function UI_displayChar(charactertext1) {
    wordtemp = deckSession.getCurrentWord();
    var strInner = '<table class="pure-table charinfo"><thead> <tr>  <th>Property</th> <th>Value</th></tr> </thead><tbody>';
    var character1 = dic1.getCharacter(charactertext1);
    strtemp = "<tr>";
    strtemp += "<td> Character</td>";
    strtemp += "<td>" + character1.getCharacter() + "</td>";
    strtemp += "</tr><tr>";
    strtemp += "<td> Pinyin</td>";
    strtemp += "<td>" + character1.getPinyin() + "</td>";
    strtemp += "</tr><tr>";
    strtemp += "<td> Translation</td>";
    strtemp += "<td>" + character1.getTranslation() + "</td>";
    strtemp += "</tr><tr>";
    strtemp += "<td> Strokes</td>";
    strtemp += "<td>" + character1.getStrokesCount() + "</td>";
    strtemp += "</tr><tr>";
    strtemp += "<td> Frequency</td>";
    strtemp += "<td>" + character1.getFrequency() + "</td>";
    strtemp += "</tr><tr>";
    strtemp += "<td> Radical</td>";
    strtemp += "<td>" + character1.getRadical() + "</td>";
    strtemp += "</tr>";
    strInner += strtemp;
    strInner += "</tbody></table>";
    return strInner;
}

function UI_displayWordsWithChar(char) {
    var wordtemp = deckSession.getCurrentWord();
    var listofWords = dic1.getWordsWithGivenCharacter(char);
    /*
@01012017 this has been transferred to the function getWordsWithGivenCharacter as it should not be in a UI function
  var index = listofWords.indexOf(wordtemp);
    listofWords.splice(index, 1);*/

    var strInner = '<p class="header">Other Words with ' + char + '</p><table class="pure-table"><thead> <tr>  <th>Word</th> <th>Pinyin</th> <th>Trans</th> </tr> </thead><tbody>';
    for (var i = 0; i < listofWords.length; i++) {
        var word1 = listofWords[i];
        strtemp = "<tr>";
        strtemp += "<td>" + word1.getWord() + "</td>";
        strtemp += "<td>" + word1.getPinyin() + "</td>";
        strtemp += "<td>" + word1.getTranslation() + "</td>";
        strtemp += "</tr>";
        strInner += strtemp;
    }
    strInner += "</tbody></table>";
    return strInner;
}

function UI_displayBreakdownChar(charKP) {
    var currentKP = charKP;
    var array = [];
    for (var i = 0; i <= 5; i++) {
        array[i] = [];
    }
    array[0].push({
        object: currentKP,
        text: currentKP.getCharacter(),
        level: 0
    });
    addCharstoTable(currentKP, array, 1);

    var strInner = '<p class="header">Breakdown of ' + charKP + '</p><table class="breakdown"><tbody>';
    for (i = 0; i < 4; i++) {
        strtemp = "<tr>";
        for (var j = 0; j < array[i].length; j++) {
            widthcol = 16 / (Math.pow(2, i));
            strtemp += '<td colspan="' + widthcol + '" class="br0">' + array[i][j].text + "</td>";
        }
        /*     for (j=array[i].length; j<16; j++) {
                 strtemp += '<td class="br'+i+'">'  + "n" +"</td>";
             }*/

        strtemp += "</tr>";
        strInner += strtemp;
    }
    strInner += "</tbody></table>";
    return strInner;
}

function addCharstoTable(charKP, array, index) {
    if (index <= 5) {
        if (charKP) {
            if (charKP.getComponent1Obj()) {
                array[index].push({
                    object: charKP.getComponent1Obj(),
                    text: charKP.getComponent1Txt(),
                    level: index
                });
                addCharstoTable(charKP.getComponent1Obj(), array, index + 1);
            } else if (charKP.getComponent1Txt()) {
                array[index].push({
                    object: null,
                    text: charKP.getComponent1Txt(),
                    level: index
                });
                addCharstoTable(null, array, index + 1);
            }


            if (charKP.getComponent2Obj()) {
                array[index].push({
                    object: charKP.getComponent2Obj(),
                    text: charKP.getComponent2Txt(),
                    level: index
                });
                addCharstoTable(charKP.getComponent2Obj(), array, index + 1);
            } else if (charKP.getComponent2Txt()) {
                {
                    array[index].push({
                        object: null,
                        text: charKP.getComponent2Txt(),
                        level: index
                    });
                    addCharstoTable(null, array, index + 1);
                }

            }
        } else { // object is null so push two null sons
            array[index].push({
                object: null,
                text: "",
                level: index
            });
            addCharstoTable(null, array, index + 1);
            array[index].push({
                object: null,
                text: "",
                level: index
            });
            addCharstoTable(null, array, index + 1);
        }
    }

}

function UI_logStatusBar(string1) {
    Materialize.toast(new Date().toUTCString() + " - " + string1, 4000);
}

// function UI_switchCardBackToFront() {
//     var NAME = document.getElementById("table");
//     var currentClass = NAME.className;
//     NAME.className = "front";
// }

function UI_printKP() {
    var char1 = document.querySelector("#chartobreak").value;
    /*    var str = dic1.getCharacterKP(char1).print();*/
    document.querySelector("#resultBreak").innerHTML = UI_displayBreakdownChar(dic1.getCharacterKP(char1));
}

function UI_getRandomChinaPic() {
    var rnd = Math.floor(Math.random() * 8) + 1;
    document.getElementById('cardimage').src = "../assets/china" + rnd + ".png";
}

function UI_lightencolor(id) {

    var name = document.getElementById(id).className;
    var name2 = "";
    name2 = name.replace('darken-2', 'lighten-1');
    document.getElementById(id).className = name2;
}

function UI_darkencolor(id) {
    var name = document.getElementById(id).className;
    var name2 = "";
    name2 = name.replace('lighten-1', 'darken-2');
    document.getElementById(id).className = name2;

}

function UI_startTime() {
    var today = new Date();
    var h = today.getHours();
    var m = today.getMinutes();
    m = UI_checkTime(m);
    document.getElementById('time').innerHTML = h + ":" + m;
    var t = setTimeout(UI_startTime, 500);
}

function UI_addTimer() {
    seconds++;
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
        if (minutes >= 60) {
            minutes = 0;
            hours++;
        }
    }

    document.getElementById('timer').innerHTML = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
    timer();
}

function UI_checkTime(i) {
    if (i < 10) {
        i = "0" + i;
    }
    // add zero in front of numbers < 10
    return i;
}

function timer() {
    t = setTimeout(UI_addTimer, 1000);
}

function UI_showMainPage_HideIntro() {
    document.getElementById("intropage").style.display = "none";
    document.getElementById("mainpage").style.display = "block";
}
