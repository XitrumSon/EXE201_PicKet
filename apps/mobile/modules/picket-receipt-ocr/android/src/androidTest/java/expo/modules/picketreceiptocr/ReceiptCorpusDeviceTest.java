package expo.modules.picketreceiptocr;

import android.test.InstrumentationTestCase;
import android.content.Context;
import android.os.Bundle;
import android.os.SystemClock;
import java.io.*;
import java.util.*;
import org.json.*;

/** Opt-in local corpus acceptance. This class and its assets never ship in release. */
public class ReceiptCorpusDeviceTest extends InstrumentationTestCase {
 public void testLocalCorpus() throws Exception {
  Context testContext=getInstrumentation().getContext();
  Context target=getInstrumentation().getTargetContext();
  JSONArray rows=new JSONArray();
  String[] files=testContext.getAssets().list(""); Arrays.sort(files);
  for(String name:files) {
   if(!name.toLowerCase(Locale.ROOT).matches(".*\\.(jpg|jpeg|png|webp)$"))continue;
   JSONObject row=new JSONObject(); row.put("file",name);
   File input=new File(target.getCacheDir(),"corpus-input");
   try(InputStream from=testContext.getAssets().open(name);OutputStream to=new FileOutputStream(input)) {
    byte[] buffer=new byte[16384];int count;while((count=from.read(buffer))!=-1)to.write(buffer,0,count);
   }
   long start=SystemClock.elapsedRealtime();ReceiptImageSession session=null;
   try {
    session=new ReceiptImageSession(target,input.toURI().toString());
    row.put("direction",new JSONObject(session.direction(20000)));
    session.select(0);
    row.put("sample",new JSONObject(session.inspect(20000)));
   } catch(Exception error){row.put("error",error.getClass().getSimpleName()+":"+error.getMessage());}
   finally {if(session!=null)session.close();input.delete();}
   row.put("durationMs",SystemClock.elapsedRealtime()-start);rows.put(row);
   File output=new File(target.getExternalFilesDir(null),"receipt-corpus.json");
   try(Writer writer=new OutputStreamWriter(new FileOutputStream(output),"UTF-8")){writer.write(rows.toString());}
   Bundle progress=new Bundle();progress.putString("bill",name);getInstrumentation().sendStatus(1,progress);
  }
  assertTrue("Supply -PpicketReceiptCorpusDir for device corpus acceptance",rows.length()>0);
 }
}
